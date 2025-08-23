const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { registerController, loginController, logoutController } = require("../Controllers/AuthController");
const { getProfile, updateProfile, deleteAccount } = require("../Controllers/UserController");
const { validateToken } = require("../Middlewares/AuthMiddleware");
const { validateRegister, validateLogin } = require("../Middlewares/Validator");
const {addProductToRoutine, viewRoutineByCategory, viewRoutineByTime, getRoutineProduct, updateRoutineProduct, deleteRoutineProduct} = require("../Controllers/RoutineProductController")

router.post("/register", validateRegister, registerController);
router.post("/login", validateLogin, loginController);
router.post("/logout", logoutController);

// Home Page
router.get("/home", validateToken, getProfile);

// Profile Page
router.get('/profile', validateToken, getProfile);
router.put('/profile', validateToken, updateProfile);
router.delete('/profile', validateToken, deleteAccount);

//Routine Product
router.post("/routine-products/:routineName/:category", addProductToRoutine); // Add product
router.get("/routine-products/view/:routineName", viewRoutineByTime); // View gabungan pagi/malam
router.get("/routine-products/view/:routineName/:category", viewRoutineByCategory); // View spesifik per kategori
router.get("/routine-products/:id", getRoutineProduct); // Get detail
router.put("/routine-products/:id", updateRoutineProduct); // Update
router.delete("/routine-products/:id", deleteRoutineProduct); // Delete

module.exports = router;
