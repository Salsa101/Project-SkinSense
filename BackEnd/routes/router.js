const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { registerController, loginController, logoutController } = require("../Controllers/AuthController");
const { getProfile, updateProfile, deleteAccount } = require("../Controllers/UserController");
const { validateToken } = require("../Middlewares/AuthMiddleware");
const { validateRegister, validateLogin } = require("../Middlewares/Validator");

router.post("/register", validateRegister, registerController);
router.post("/login", validateLogin, loginController);
router.post("/logout", logoutController);

// Home Page
router.get("/home", validateToken, getProfile);

// Profile Page
router.get('/profile', validateToken, getProfile);
router.put('/profile', validateToken, updateProfile);
router.delete('/profile', validateToken, deleteAccount);

module.exports = router;
