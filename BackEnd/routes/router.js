const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { registerController, loginController, logoutController } = require("../Controllers/AuthController");
const { getProfile } = require("../Controllers/UserController");
const { validateToken } = require("../Middlewares/AuthMiddleware");
const { validateRegister, validateLogin } = require("../Middlewares/Validator");

router.post("/register", validateRegister, registerController);
router.post("/login", validateLogin, loginController);
router.post("/logout", logoutController);

router.get("/home", validateToken, getProfile);

module.exports = router;
