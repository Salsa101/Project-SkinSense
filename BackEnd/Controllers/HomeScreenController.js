const { ResultScan } = require("../models");

const getLatestScan = async (req, res) => {
  try {
    const userId = req.user.id;

    const latestScan = await ResultScan.findOne({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    if (!latestScan) {
      return res.status(404).json({ message: "No scan result found" });
    }

    res.status(200).json(latestScan);
  } catch (error) {
    console.error("Error fetching latest scan:", error);
    res.status(500).json({ message: "Error fetching latest scan", error });
  }
};

module.exports = { getLatestScan };
