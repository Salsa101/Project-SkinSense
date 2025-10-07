const { ResultScan } = require("../models");

const getScanDetail = async (req, res) => {
  try {
    const userId = req.user.id;

    const scans = await ResultScan.findAll({
      where: { userId },
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
        score: Math.floor(Math.random() * 21) + 80,
        // sementara ingredient & produk dummy
        ingredientsForYou: [
          "Centella Asiatica",
          "Jojoba Oil",
          "Ceramide NP",
          "Hyaluronic Acid",
        ],
        avoidIngredients: ["Alcohol", "Fragrance", "Coconut Oil", "AHA/BHA"],
        products: [
          {
            name: "Hydrating Serum",
            image: "https://via.placeholder.com/100",
          },
          {
            name: "Soothing Toner",
            image: "https://via.placeholder.com/100",
          },
          {
            name: "Barrier Cream",
            image: "https://via.placeholder.com/100",
          },
        ],
      });
    });

    res.status(200).json({
      success: true,
      data: groupedData,
    });
  } catch (error) {
    console.error("Error fetching compare scan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch compare scan data",
      error: error.message,
    });
  }
};

// Delete scan by ID
const deleteScan = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const scan = await ResultScan.findOne({ where: { id, userId } });
    if (!scan) {
      return res.status(404).json({
        success: false,
        message: "Scan not found or you don't have permission to delete it",
      });
    }

    await ResultScan.destroy({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Scan deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting scan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete scan",
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

module.exports = { getScanDetail, deleteScan, compareScans, getCompareScans };
