const {
  ResultScan,
  RoutineProduct,
  Product,
  News,
  Category,
} = require("../models");
const { Op } = require("sequelize");

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

const getExpiringSoon = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(today.getDate() + 14);

    const expiringProducts = await RoutineProduct.findAll({
      where: {
        userId,
        expirationDate: {
          [Op.between]: [today, twoWeeksLater],
        },
      },
      include: [
        {
          model: Product,
          attributes: ["productName", "productType"],
        },
      ],
      order: [["expirationDate", "ASC"]],
    });

    res.status(200).json({
      success: true,
      data: expiringProducts,
    });
  } catch (error) {
    console.error("Error fetching expiring products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch expiring products",
      error: error.message,
    });
  }
};

const getWeeklyTip = async (req, res) => {
  try {
    const allNews = await News.findAll({
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
    });

    if (!allNews.length) {
      return res.status(404).json({ success: false, message: "No news found" });
    }

    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const weekNumber = Math.floor(
      ((today - startOfYear) / (1000 * 60 * 60 * 24) +
        startOfYear.getDay() +
        1) /
        7
    );

    const newsIndex = weekNumber % allNews.length;
    const weeklyNews = allNews[newsIndex];

    res.status(200).json({
      success: true,
      data: weeklyNews,
    });
  } catch (error) {
    console.error("Error fetching weekly news:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch weekly news",
      error: error.message,
    });
  }
};

const getRoutineProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const morningTotal = await RoutineProduct.count({
      where: { timeOfDay: "morning", userId },
    });
    const morningDone = await RoutineProduct.count({
      where: { timeOfDay: "morning", doneStatus: true, userId },
    });

    const nightTotal = await RoutineProduct.count({
      where: { timeOfDay: "night", userId },
    });
    const nightDone = await RoutineProduct.count({
      where: { timeOfDay: "night", doneStatus: true, useId },
    });

    return res.json({
      success: true,
      data: {
        morning: {
          done: morningDone,
          total: morningTotal,
        },
        night: {
          done: nightDone,
          total: nightTotal,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching routine progress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch routine progress",
    });
  }
};

module.exports = {
  getLatestScan,
  getExpiringSoon,
  getWeeklyTip,
  getRoutineProgress,
};
