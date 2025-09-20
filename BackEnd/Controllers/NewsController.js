const { News, Category, User, Bookmark } = require("../models");
const { Op } = require("sequelize");

// 1. Get news list + search + filter by category
const getNews = async (req, res) => {
  try {
    const { search, category } = req.query;

    const where = {};
    if (search) where.title = { [Op.iLike]: `%${search}%` };
    if (category) where.categoryId = category;

    const news = await News.findAll({
      where,
      include: [{ model: Category, attributes: ["id", "name"] }],
      attributes: [
        "id",
        "title",
        "content",
        "newsImage",
        "categoryId",
        "createdAt",
      ],
    });

    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. Get news detail
const getNewsDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByPk(id, {
      include: [{ model: Category, attributes: ["id", "name"] }],
      attributes: [
        "id",
        "title",
        "content",
        "newsImage",
        "categoryId",
        "createdAt",
      ],
    });

    if (!news) return res.status(404).json({ message: "News not found" });

    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 3. Bookmark news
const bookmarkNews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newsId } = req.params;

    const news = await News.findByPk(newsId);
    if (!news) return res.status(404).json({ message: "News not found" });

    const user = await User.findByPk(userId);
    await user.addNews(news);

    res.json({ message: "News bookmarked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 4. Unbookmark news
const unbookmarkNews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newsId } = req.params;

    const news = await News.findByPk(newsId);
    if (!news) return res.status(404).json({ message: "News not found" });

    const user = await User.findByPk(userId);
    await user.removeNews(news);

    res.json({ message: "News unbookmarked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 5. List bookmarks of user
const listBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      include: {
        model: News,
        include: [{ model: Category, attributes: ["id", "name"] }],
        attributes: [
          "id",
          "title",
          "content",
          "newsImage",
          "categoryId",
          "createdAt",
        ],
      },
    });

    res.json(user.News);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getNews,
  getNewsDetail,
  bookmarkNews,
  unbookmarkNews,
  listBookmarks,
};
