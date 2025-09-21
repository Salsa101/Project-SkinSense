const { News, Category, User, Bookmark } = require("../models");
const { Op } = require("sequelize");

const getNews = async (req, res) => {
  try {
    const { search, category } = req.query;

    const where = {};
    if (search) where.title = { [Op.iLike]: `%${search}%` };

    const include = [
      {
        model: Category,
        attributes: ["id", "name", "isActive"],
        through: { attributes: [] },
        where: { isActive: true, ...(category ? { id: category } : {}) },
        required: false, // supaya news tanpa kategori aktif tetap muncul
      },
    ];

    const news = await News.findAll({
      where,
      include,
      attributes: ["id", "title", "content", "newsImage", "createdAt"],
    });

    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getNewsDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByPk(id, {
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
          where: { isActive: true },
          required: false,
        },
      ],
      attributes: ["id", "title", "content", "newsImage", "createdAt"],
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

const getCategory = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true },
      attributes: ["id", "name", "isActive"],
    });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getNewsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId)
      return res.status(400).json({ message: "Category ID required" });

    const news = await News.findAll({
      include: [
        {
          model: Category,
          attributes: ["id", "name", "isActive"],
          where: { id: categoryId, isActive: true }, // filter per categoryId
          through: { attributes: [] },
        },
      ],
      attributes: ["id", "title", "content", "newsImage", "createdAt"],
    });

    res.json(news);
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
  getCategory,
  getNewsByCategory,
};
