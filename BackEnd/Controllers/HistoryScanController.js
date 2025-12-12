const {
  ResultScan,
  QuizUserAnswer,
  QuizQuestion,
  QuizOption,
  ResultScanQuizUserAnswer,
  ResultScanIngredient,
  ResultScanProduct,
  Ingredient,
  Product,
} = require("../models");
const fs = require("fs");
const path = require("path");

const deleteFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error("Gagal hapus file:", err);
  }
};

const getScanQuizDetail = async (req, res) => {
  try {
    const userId = req.user.id;

    const scans = await ResultScan.findAll({
      where: { userId },
      include: [
        {
          model: QuizUserAnswer,
          as: "quizAnswers",
          through: { attributes: [] },
          include: [
            {
              model: QuizQuestion,
              as: "quizQuestion",
              attributes: ["id", "quizQuestion"],
            },
            {
              model: QuizOption,
              as: "quizOption",
              attributes: ["id", "title"],
            },
          ],
        },
        // === INGREDIENTS ===
        {
          model: Ingredient,
          as: "ingredients",
          attributes: ["name"],
          through: { attributes: ["score"] },
        },
        // === PRODUCTS ===
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

        // === QUIZ ===
        quiz: scan.quizAnswers
          .sort((a, b) => a.quizQuestion.id - b.quizQuestion.id)
          .map((q) => ({
            id: q.id,
            question: q.quizQuestion.quizQuestion,
            option: q.quizOption.title,
            date: q.createdAt,
          })),

        // === INGREDIENTS FOR YOU ===
        ingredientsForYou: scan.ingredients.map((i) => i.name),

        // === AVOID INGREDIENTS (dummy dulu) ===
        avoidIngredients: ["Alcohol", "Fragrance", "Coconut Oil"],

        // === PRODUCTS ===
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
    console.error("Error fetching scan+quiz detail:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch scan and quiz detail",
      error: error.message,
    });
  }
};

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

    const links = await ResultScanQuizUserAnswer.findAll({
      where: { resultScanId: id },
    });

    const quizAnswerIds = links.map((link) => link.quizUserAnswerId);

    if (quizAnswerIds.length > 0) {
      await QuizUserAnswer.destroy({
        where: { id: quizAnswerIds },
      });
    }

    if (scan.imagePath) {
      const filePath = path.join(
        __dirname,
        "..",
        scan.imagePath.replace("/uploads", "uploads")
      );
      deleteFile(filePath);
    }

    await ResultScanQuizUserAnswer.destroy({ where: { resultScanId: id } });
    await ResultScan.destroy({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Scan and related quiz answers deleted successfully",
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

// Product Information
const getProductInfo = async (req, res) => {
  try {
    const { id } = req.params;

    // Ambil produk beserta ingredients yang diperlukan
    const product = await Product.findOne({
      where: { id },
      attributes: [
        "productImage",
        "productName",
        "productBrand",
        "productType",
      ], // hanya field yang dibutuhkan
      include: [
        {
          model: Ingredient,
          as: "Ingredients",
          attributes: ["name", "description"], // hanya name dan description
          through: { attributes: [] }, // hilangkan info junction table
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getScanQuizDetail, deleteScan, getProductInfo };
