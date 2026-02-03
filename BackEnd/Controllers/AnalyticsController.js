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
    const { filter = "monthly", year } = req.query;

    // Tentukan format EXTRACT sesuai filter
    let dateFormat, monthNames;
    switch (filter) {
      case "daily":
        dateFormat = `EXTRACT(DAY FROM "createdAt")`;
        break;
      case "weekly":
        dateFormat = `EXTRACT(WEEK FROM "createdAt")`;
        break;
      case "monthly":
        dateFormat = `EXTRACT(MONTH FROM "createdAt")`;
        monthNames = [
          "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
          "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
        ];
        break;
      case "yearly":
        dateFormat = `EXTRACT(YEAR FROM "createdAt")`;
        break;
      default:
        // fallback ke monthly
        dateFormat = `EXTRACT(MONTH FROM "createdAt")`;
        monthNames = [
          "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
          "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
        ];
        break;
    }

    // Where clause optional filter tahun
    const whereClause = {};
    if (year) {
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${year}-12-31`);
      whereClause.createdAt = { [Op.between]: [start, end] };
    }

    // 1. User Growth
    const users = await User.findAll({
      attributes: [
        [literal(dateFormat), "period"],
        [fn("COUNT", col("id")), "users"],
      ],
      where: whereClause,
      group: [literal(dateFormat)],
      raw: true,
    });

    const usersFormatted = users.map(u => ({
      period: (filter === "monthly" || filter === "weekly") && monthNames
        ? monthNames[parseInt(u.period) - 1]
        : u.period,
      users: u.users,
    }));

    // 2. Top 5 News (Bookmark + Category)
    const topNews = await News.findAll({
      attributes: [
        "title",
        [fn("COUNT", col("Users->Bookmark.userId")), "count"],
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
      where: whereClause,
      group: ["News.id", "Categories.id"],
      order: [[literal("count"), "DESC"]],
      limit: 5,
      subQuery: false,
    });

    // 3. Top 5 Most Used Product
    const topProducts = await Product.findAll({
      attributes: [
        "productName",
        [fn("COUNT", col("RoutineProducts.id")), "count"],
      ],
      include: [
        { association: "RoutineProducts", attributes: [] },
      ],
      where: whereClause,
      group: ["Product.id"],
      order: [[literal("count"), "DESC"]],
      limit: 5,
      raw: true,
      subQuery: false,
    });

    // 4. Face Scans Activity
    const scans = await Scan.findAll({
      attributes: [
        [literal(dateFormat), "period"],
        [fn("COUNT", col("id")), "count"],
      ],
      where: whereClause,
      group: [literal(dateFormat)],
      raw: true,
      subQuery: false,
    });

    const scansFormatted = scans.map(s => ({
      period: (filter === "monthly" || filter === "weekly") && monthNames
        ? monthNames[parseInt(s.period) - 1]
        : s.period,
      count: s.count,
    }));

    res.json({
      userGrowth: usersFormatted,
      topNewsBookmark: topNews,
      topProducts,
      faceScanActivity: scansFormatted,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};

module.exports = { getAnalytics };
