const {
  User,
  Product,
  News,
  Bookmark,
  Category,
  Scan,
  sequelize,
} = require("../models");
const { Op, fn, col, literal } = require("sequelize");

const getAnalytics = async (req, res) => {
  try {
    // 1. User Growth per month
    const users = await User.findAll({
      attributes: [
        [sequelize.literal(`EXTRACT(MONTH FROM "createdAt")`), "monthNumber"],
        [sequelize.fn("COUNT", sequelize.col("id")), "users"],
      ],
      group: [sequelize.literal(`EXTRACT(MONTH FROM "createdAt")`)],
      subQuery: false,
      raw: true,
    });

    // Map angka bulan ke nama bulan
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const usersWithMonthName = users.map((u) => ({
      month: monthNames[parseInt(u.monthNumber) - 1],
      users: u.users,
    }));

    // 2. Top 5 News Users Bookmark and Categories
    const topNews = await News.findAll({
      attributes: [
        "title",
        [
          sequelize.fn("COUNT", sequelize.col("Users->Bookmark.userId")),
          "count",
        ],
      ],
      include: [
        {
          model: User,
          through: { model: Bookmark, attributes: [] },
          attributes: [],
        },
        {
          model: Category,
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
      group: ["News.id", "Categories.id"],
      order: [[sequelize.literal("count"), "DESC"]],
      limit: 5,
      subQuery: false,
    });

    // 3. Top 5 Most Used Product
    const topProducts = await Product.findAll({
      attributes: [
        "productName",
        [sequelize.fn("COUNT", sequelize.col("RoutineProducts.id")), "count"],
      ],
      include: [
        {
          association: "RoutineProducts",
          attributes: [],
        },
      ],
      group: ["Product.id"],
      order: [[sequelize.literal("count"), "DESC"]],
      limit: 5,
      subQuery: false,
      raw: true,
    });

    //Scan
    const faceScans = await Scan.findAll({
      attributes: [
        [literal(`EXTRACT(MONTH FROM "createdAt")`), "monthNumber"],
        [fn("COUNT", col("id")), "count"],
      ],
      group: [literal(`EXTRACT(MONTH FROM "createdAt")`)],
      subQuery: false,
      raw: true,
    });

    const faceScanWithMonth = faceScans.map((f) => ({
      month: monthNames[parseInt(f.monthNumber) - 1],
      count: f.count,
    }));

    res.json({
      userGrowth: usersWithMonthName,
      topNewsBookmark: topNews,
      topProducts: topProducts,
      faceScanActivity: faceScanWithMonth,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};

module.exports = { getAnalytics };
