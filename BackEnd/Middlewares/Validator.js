const { body } = require("express-validator");

const validateRegister = [
  body("username").notEmpty().withMessage("Username wajib diisi"),
  body("email").isEmail().withMessage("Email tidak valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Konfirmasi password wajib diisi"),
];

const validateLogin = [
  body("username").notEmpty().withMessage("Username wajib diisi"),
  body("password").notEmpty().withMessage("Password wajib diisi"),
];

module.exports = {
  validateRegister,
  validateLogin,
};
