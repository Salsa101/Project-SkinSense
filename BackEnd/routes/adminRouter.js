const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const { validateToken } = require("../Middlewares/AuthMiddleware");
const { validateLogin } = require("../Middlewares/Validator");

const {
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
} = require("../Controllers/AdminController");

const { isAdmin } = require("../Middlewares/AdminMiddleware");
const upload = require("../Middlewares/UploadImage");

//Auth Admin
router.get("/check-auth", validateToken, (req, res) => {
  res.json({ message: "Token valid", user: req.user });
});
router.post("/login", validateLogin, adminLoginController);
router.post("/logout", adminLogoutController);

//Product Admin
router.get("/products", validateToken, isAdmin, getAllProducts);
router.post(
  "/add-product",
  validateToken,
  isAdmin,
  upload("products").single("productImage"),
  addProduct
);
router.delete("/delete-product", validateToken, isAdmin, deleteAdminProduct);
router.get("/products/:id", validateToken, isAdmin, getProductById);
router.put(
  "/products/update/:id",
  validateToken,
  isAdmin,
  upload("products").single("productImage"),
  updateProduct
);
router.put("/products/:id/verify", validateToken, isAdmin, verifiedProduct);

//News Route
router.get("/news", validateToken, isAdmin, getNews);
router.post(
  "/news/add",
  validateToken,
  isAdmin,
  upload("news").single("newsImage"),
  addNews
);
router.get("/news/:id", validateToken, isAdmin, getNewsDetail);
router.put(
  "/news/edit/:id",
  validateToken,
  isAdmin,
  upload("news").single("newsImage"),
  editNews
);
router.delete("/news/delete/:id", validateToken, isAdmin, deleteNews);
router.put("/news/:id/active", validateToken, isAdmin, toggleNewsActive);

//Category Route
router.get("/categories", validateToken, isAdmin, getCategory);
router.post("/categories/add", validateToken, isAdmin, addCategory);
router.get("/categories/:id", validateToken, isAdmin, getCategoryDetail);
router.put("/categories/edit/:id", validateToken, isAdmin, editCategory);
router.delete("/categories/delete/:id", validateToken, isAdmin, deleteCategory);
router.put(
  "/categories/:id/isactive",
  validateToken,
  isAdmin,
  isActiveCategory
);

module.exports = router;
