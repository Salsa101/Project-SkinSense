const { User, Product } = require("../models");
const { News, Category, Ingredient, ProductIngredient } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");

const deleteFile = (filePath) => {
  try {
    if (!filePath) return;

    // bikin full path dari root project
    const absolutePath = path.join(__dirname, "..", filePath);

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      console.log("File dihapus:", absolutePath);
    } else {
      console.log("File tidak ditemukan:", absolutePath);
    }
  } catch (err) {
    console.error("Gagal hapus file:", err);
  }
};

// ========== Auth Page ==========

//Login
const adminLoginController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user)
      return res.status(401).json({ message: "Username tidak ditemukan." });
    if (user.role !== "admin")
      return res.status(403).json({ message: "Hanya admin yang bisa login." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Password salah." });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.json({
      message: "Login admin berhasil",
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan login admin" });
  }
};

//Logout
const adminLogoutController = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout berhasil" });
};

// ========== Product Page ==========

//View Product
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email", "role"],
        },
        {
          model: Ingredient,
          as: "Ingredients",
          attributes: ["id", "name", "tags"],
          through: { attributes: [] },
        },
      ],
      order: [["id", "DESC"]],
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data produk" });
  }
};

//Add Product
const addProduct = async (req, res) => {
  try {
    const { productName, productBrand, productType } = req.body;
    const ingredients = JSON.parse(req.body.ingredients);

    const newProduct = await Product.create({
      productName,
      productBrand,
      productType,
      productImage: req.file
        ? `/uploads/${req.user.id}/products/${req.file.filename}`
        : null,
      userId: req.user.id,
    });

    await newProduct.setIngredients(ingredients);

    res.json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

//Delete Product
const deleteAdminProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID produk wajib dikirim" });
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    deleteFile(product.productImage);

    // hapus produk
    await product.destroy();

    res.json({ message: "Produk berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus produk" });
  }
};

//Get Detail
const getProductById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    const product = await Product.findOne({
      where: { id },
      include: [
        {
          model: Ingredient,
          as: "Ingredients",
          attributes: ["id", "name", "tags"],
          through: { attributes: [] },
        },
      ],
    });

    if (!product)
      return res.status(404).json({ message: "Produk tidak ditemukan" });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data produk" });
  }
};

//Update
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, productBrand, productType } = req.body;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (productName) product.productName = productName;
    if (productBrand) product.productBrand = productBrand;
    if (productType) product.productType = productType;

    if (req.file) {
      // hapus file lama
      deleteFile(product.productImage);
      product.productImage = `/uploads/${req.user.id}/products/${req.file.filename}`;
    }

    if (req.body.ingredients) {
      const ingredientIds = JSON.parse(req.body.ingredients);
      await product.setIngredients(ingredientIds);
    }

    await product.save();

    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Verified Admin
const verifiedProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.isVerified = isVerified;
    await product.save();

    res.json({ message: "Product verification updated", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========== News Page ==========

//Get News
const getNews = async (req, res) => {
  try {
    const news = await News.findAll({
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
          through: { attributes: [] },
          where: { isActive: true },
          required: false,
        },
      ],
      attributes: [
        "id",
        "title",
        "content",
        "newsImage",
        "isActive",
        "createdAt",
      ],
      order: [["id", "DESC"]],
    });

    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Add News
const addNews = async (req, res) => {
  try {
    let { title, content, categoryIds, isActive } = req.body;
    if (isActive === undefined) isActive = true; // fallback default

    const newsImage = req.file
      ? `/uploads/${req.user.id}/news/${req.file.filename}`
      : null;

    if (!title || !content || !categoryIds)
      return res.status(400).json({ message: "All fields are required" });

    if (!Array.isArray(categoryIds)) categoryIds = [categoryIds];

    categoryIds = categoryIds.map((id) => parseInt(id));

    const news = await News.create({
      title,
      content,
      newsImage,
      isActive,
      userId: req.user.id,
    });

    await news.setCategories(categoryIds);

    res.status(201).json({ message: "News added successfully", news });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Get News Detail
const getNewsDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByPk(id, {
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
          through: { attributes: [] },
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

//Edit News
const editNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, categoryIds, isActive } = req.body;

    const news = await News.findByPk(id);
    if (!news) return res.status(404).json({ message: "News not found" });

    if (title) news.title = title;
    if (content) news.content = content;
    if (typeof isActive !== "undefined") news.isActive = isActive;

    if (req.file) {
      // hapus gambar lama
      deleteFile(news.newsImage);
      news.newsImage = `/uploads/${req.user.id}/news/${req.file.filename}`;
    }

    await news.save();

    if (categoryIds && Array.isArray(categoryIds)) {
      const validCategories = await Category.findAll({
        where: { id: categoryIds },
      });
      await news.setCategories(validCategories);
    }

    const updatedNews = await News.findByPk(id, {
      include: [{ model: Category, attributes: ["id", "name"] }],
    });

    res.json(updatedNews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Delete News
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByPk(id);
    if (!news) return res.status(404).json({ message: "News not found" });

    deleteFile(news.newsImage);

    await news.destroy();

    res.json({ message: "News deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const toggleNewsActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const news = await News.findByPk(id);
    if (!news) return res.status(404).json({ message: "News not found" });

    news.isActive = isActive;
    await news.save();

    res.json({ message: "News status updated", news });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Add Category
const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });

    const existing = await Category.findOne({ where: { name } });
    if (existing)
      return res.status(400).json({ message: "Category already exists" });

    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Get Category
const getCategory = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "name", "isActive"],
      order: [["id", "DESC"]],
    });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Update Category
const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByPk(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    category.name = name;
    await category.save();

    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Delete Category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    // Soft delete
    category.isActive = false;
    await category.save();

    res.json({ message: "Category archived (soft delete)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Get Detail Category
const getCategoryDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Is Active Category
const isActiveCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const category = await Category.findByPk(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    category.isActive = isActive;
    await category.save();

    res.json({ message: "Category status updated", category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// const getIngredients = async (req, res) => {
//   const ingredients = await Ingredient.findAll({ order: [["name", "ASC"]] });
//   res.json(ingredients);
// };

const getIngredients = async (req, res) => {
  const search = req.query.search || "";

  const ingredients = await Ingredient.findAll({
    where: {
      name: {
        [Op.iLike]: `%${search}%`,
      },
    },
    order: [["id", "DESC"]],
  });

  res.json(ingredients);
};

const addIngredient = async (req, res) => {
  try {
    const { name, isSensitive, isOily, weight, skinTypes, tags, description } =
      req.body;

    const ingredient = await Ingredient.create({
      name,
      isSensitive,
      isOily,
      weight,
      skinTypes: skinTypes.map((s) => s.toLowerCase()),
      tags,
      description,
    });

    res.json(ingredient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteIngredient = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Ingredient ID is required" });
    }

    await ProductIngredient.destroy({
      where: { ingredients_id: id },
    });

    const deleted = await Ingredient.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Ingredient not found" });
    }

    res.json({ message: "Ingredient deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const getIngredientById = async (req, res) => {
  try {
    const id = req.params.id;
    const ingredient = await Ingredient.findByPk(id);

    if (!ingredient) return res.status(404).json({ message: "Not found" });

    res.json(ingredient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateIngredient = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, isSensitive, isOily, weight, skinTypes, tags, description } =
      req.body;

    const ingredient = await Ingredient.findByPk(id);
    if (!ingredient) return res.status(404).json({ message: "Not found" });

    ingredient.name = name;
    ingredient.isSensitive = isSensitive;
    ingredient.isOily = isOily;
    ingredient.weight = weight;
    ingredient.skinTypes = skinTypes.map((s) => s.toLowerCase());
    ingredient.tags = tags;
    ingredient.description = description;

    await ingredient.save();

    res.json({ message: "Ingredient updated", ingredient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  adminLoginController,
  adminLogoutController,
  getAllProducts,
  addProduct,
  deleteAdminProduct,
  getProductById,
  updateProduct,
  verifiedProduct,
  getNews,
  addNews,
  getNewsDetail,
  editNews,
  deleteNews,
  addCategory,
  getCategory,
  editCategory,
  deleteCategory,
  getCategoryDetail,
  isActiveCategory,
  toggleNewsActive,
  getIngredients,
  addIngredient,
  deleteIngredient,
  getIngredientById,
  updateIngredient,
};
