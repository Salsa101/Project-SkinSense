const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");

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
} = require("../Controllers/AdminController");

const { isAdmin } = require("../Middlewares/AdminMiddleware");

// setup multer (upload ke folder /uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  },
});
const upload = multer({ storage });

router.get("/check-auth", validateToken, (req, res) => {
  res.json({ message: "Token valid", user: req.user });
});

router.post("/login", validateLogin, adminLoginController);
router.post("/logout", adminLogoutController);

router.get("/products", validateToken, isAdmin, getAllProducts);
router.post(
  "/add-product",
  upload.single("productImage"),
  validateToken,
  isAdmin,
  addProduct
);
router.delete("/delete-product", validateToken, isAdmin, deleteAdminProduct);
router.get("/products/:id", validateToken, isAdmin, getProductById);
// routes
router.put(
  "/products/update/:id",
  upload.single("productImage"),
  validateToken,
  isAdmin,
  updateProduct
);

module.exports = router;
