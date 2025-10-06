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

module.exports = { getScanDetail, deleteScan };
