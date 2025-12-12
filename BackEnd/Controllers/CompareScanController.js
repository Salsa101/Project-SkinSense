const { ResultScan, Product, Ingredient } = require("../models");

const getScanDetail = async (req, res) => {
  try {
    const userId = req.user.id;

    const scans = await ResultScan.findAll({
      where: { userId },
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          attributes: ["name"],
          through: { attributes: ["score"] },
        },
        {
          model: Product,
          as: "products",
          attributes: [
            "id",
            "productName",
            "productBrand",
            "productType",
            "productImage",
          ],
          through: { attributes: [] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const groupedData = {};

    scans.forEach((scan) => {
      const dateKey = scan.createdAt.toISOString().split("T")[0];
      if (!groupedData[dateKey]) groupedData[dateKey] = [];

      groupedData[dateKey].push({
        id: scan.id,
        time: scan.createdAt.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        imagePath: scan.imagePath,
        skinType: scan.skinType,
        severity: scan.severity,
        acneCount: scan.acneCount,
        score: scan.score,

        ingredientsForYou: scan.ingredients.map((i) => i.name),

        avoidIngredients: ["Alcohol", "Fragrance", "Coconut Oil"],

        products: scan.products.map((p) => ({
          id: p.id,
          name: p.productName,
          brand: p.productBrand,
          type: p.productType,
          image: p.productImage,
        })),
      });
    });

    res.status(200).json({
      success: true,
      data: groupedData,
    });
  } catch (error) {
    console.error("Error fetching scan detail:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch scan data",
      error: error.message,
    });
  }
};

// Compare 2 scans selected by user
const compareScans = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstScanId, secondScanId } = req.body;

    // Validasi input
    if (!firstScanId || !secondScanId) {
      return res.status(400).json({
        success: false,
        message: "Please provide two scan IDs to compare",
      });
    }

    // Ambil data kedua scan dari database tanpa urutkan
    const scans = await ResultScan.findAll({
      where: { id: [firstScanId, secondScanId], userId },
      order: [["createdAt", "ASC"]],
    });

    if (scans.length !== 2) {
      return res.status(404).json({
        success: false,
        message: "One or both scans not found or not owned by user",
      });
    }

    const [before, after] = scans;
    const acneDiff = after.acneCount - before.acneCount;

    let severityDescription = "";
    switch (after.severity) {
      case "High":
        severityDescription =
          "Many active and red acne, skin feels sore and inflamed";
        break;
      case "Medium":
        severityDescription =
          "Acne still appears in some areas, but the inflammation is starting to subside.";
        break;
      case "Low":
        severityDescription =
          "There are only a few small acne or scars, the texture is starting to even out.";
        break;
      case "No acne detected":
        severityDescription =
          "There are almost no acnes, the skin looks clean and calm";
        break;
      default:
        severityDescription = "Severity information not available";
    }

    // --- Score rating ---
    let afterScoreRating = "";
    const afterScore = after.score;
    if (afterScore >= 0 && afterScore <= 49) afterScoreRating = "Poor";
    else if (afterScore >= 50 && afterScore <= 69) afterScoreRating = "Fair";
    else if (afterScore >= 70 && afterScore <= 84) afterScoreRating = "Good";
    else if (afterScore >= 85 && afterScore <= 95)
      afterScoreRating = "Excellent";

    // --- Note perubahan skor ---
    let scoreNote = "";
    const scoreDiff = afterScore - before.score;
    if (scoreDiff > 0) {
      scoreNote = `Skin health improved by ${scoreDiff} points — indicating better hydration and reduced acne activity.`;
    } else if (scoreDiff < 0) {
      scoreNote = `Skin health reduced by ${Math.abs(
        scoreDiff
      )} points — indicating lower hydration level and possible increase in acne activity.`;
    }

    // Buat respons perbandingan
    const comparison = {
      before: {
        id: before.id,
        date: before.createdAt.toISOString().split("T")[0],
        time: before.createdAt.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        imagePath: before.imagePath,
        skinType: before.skinType,
        severity: before.severity,
        acneCount: before.acneCount,
        score: before.score,
      },
      after: {
        id: after.id,
        date: after.createdAt.toISOString().split("T")[0],
        time: after.createdAt.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        imagePath: after.imagePath,
        skinType: after.skinType,
        severity: after.severity,
        acneCount: after.acneCount,
        score: after.score,
        rating: afterScoreRating,
      },
      difference: {
        acneChange:
          acneDiff > 0
            ? `+${acneDiff} new spots`
            : acneDiff < 0
            ? `${acneDiff} spots reduced`
            : "No acne detected",
        severityChange: severityDescription,
        scoreChangeNote: scoreNote,
      },
    };

    res.status(200).json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    console.error("Error comparing scans:", error);
    res.status(500).json({
      success: false,
      message: "Failed to compare scans",
      error: error.message,
    });
  }
};

const getCompareScans = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstScanId, secondScanId } = req.params;

    if (!firstScanId || !secondScanId) {
      return res.status(400).json({
        success: false,
        message: "Please provide two scan IDs in params",
      });
    }

    const scans = await ResultScan.findAll({
      where: { id: [firstScanId, secondScanId], userId },
      order: [["createdAt", "ASC"]],
    });

    if (scans.length !== 2) {
      return res.status(404).json({
        success: false,
        message: "One or both scans not found or not owned by user",
      });
    }

    const [before, after] = scans;
    const acneDiff = after.acneCount - before.acneCount;

    // Tentukan deskripsi severity berdasarkan after.severity
    let severityDescription = "";
    switch (after.severity) {
      case "High":
        severityDescription =
          "Many active and red acne, skin feels sore and inflamed";
        break;
      case "Medium":
        severityDescription =
          "Acne still appears in some areas, but the inflammation is starting to subside.";
        break;
      case "Low":
        severityDescription =
          "There are only a few small acne or scars, the texture is starting to even out.";
        break;
      case "No acne detected":
        severityDescription =
          "There are almost no acnes, the skin looks clean and calm";
        break;
      default:
        severityDescription = "Severity information not available";
    }

    const comparison = {
      before: {
        id: before.id,
        date: before.createdAt.toISOString().split("T")[0],
        time: before.createdAt.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        imagePath: before.imagePath,
        skinType: before.skinType,
        severity: before.severity,
        acneCount: before.acneCount,
        score: Math.floor(Math.random() * 21) + 70,
      },
      after: {
        id: after.id,
        date: after.createdAt.toISOString().split("T")[0],
        time: after.createdAt.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        imagePath: after.imagePath,
        skinType: after.skinType,
        severity: after.severity,
        acneCount: after.acneCount,
        score: Math.floor(Math.random() * 21) + 80,
      },
      difference: {
        acneChange:
          acneDiff > 0
            ? `+${acneDiff} new spots`
            : acneDiff < 0
            ? `${acneDiff} spots reduced`
            : "No acne detected",
        severityChange: severityDescription,
      },
    };

    res.status(200).json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    console.error("Error getting compare scans:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get compare scans",
      error: error.message,
    });
  }
};

module.exports = { getScanDetail, compareScans, getCompareScans };
