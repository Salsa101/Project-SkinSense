const { User, Product } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");
const { validationResult } = require("express-validator");

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
      ],
      order: [["createdAt", "DESC"]],
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

    const newProduct = await Product.create({
      productName,
      productBrand,
      productType,
      productImage: req.file ? `/uploads/${req.file.filename}` : null,
      userId: req.user.id, // ambil dari token
    });

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

    const product = await Product.findOne({ where: { id } });
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

    const data = { productName, productBrand, productType };
    if (req.file) {
      data.productImage = `/uploads/${req.file.filename}`;
    }

    const [updated] = await Product.update(data, { where: { id } });

    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated successfully" });
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

module.exports = {
  adminLoginController,
  adminLogoutController,
  getAllProducts,
  addProduct,
  deleteAdminProduct,
  getProductById,
  updateProduct,
  verifiedProduct,
};
