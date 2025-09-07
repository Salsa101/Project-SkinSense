const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const {
  registerController,
  loginController,
  logoutController,
} = require("../Controllers/AuthController");
const {
  getProfile,
  updateProfile,
  deleteAccount,
} = require("../Controllers/UserController");
const { validateToken } = require("../Middlewares/AuthMiddleware");
const { validateRegister, validateLogin } = require("../Middlewares/Validator");
const {
  addProductToRoutine,
  viewRoutineByCategory,
  viewRoutineByTime,
  getRoutineProduct,
  updateRoutineProduct,
  deleteRoutineProduct,
  uploadProduct,
  toggleDone,
} = require("../Controllers/RoutineProductController");
const {
  getQuestions,
  submitAnswers,
} = require("../Controllers/QuizController");
const upload = require("../Middlewares/UploadImage");

router.post("/register", validateRegister, registerController);
router.post("/login", validateLogin, loginController);
router.post("/logout", logoutController);

// Home Page
router.get("/home", validateToken, getProfile);

// Profile Page
router.get("/profile", validateToken, getProfile);
router.put("/profile", validateToken, updateProfile);
router.delete("/profile", validateToken, deleteAccount);

//Routine Product
router.post(
  "/add-routine-products",
  validateToken,
  upload.single("productImage"),
  addProductToRoutine
);
router.get(
  "/routine-products/view/:routineType/:timeOfDay",
  validateToken,
  viewRoutineByCategory
);
router.get(
  "/routine-products/view/:routineName",
  validateToken,
  viewRoutineByTime
);
router.patch("/routine-products/toggle-done", validateToken, toggleDone);

//Skin Quiz
router.get("/question", validateToken, getQuestions);
router.post("/answer", validateToken, submitAnswers);

router.get("/routine-products/:id", getRoutineProduct); // Get detail
router.put("/routine-products/:id", updateRoutineProduct); // Update
router.delete("/routine-products/:id", deleteRoutineProduct); // Delete

router.post("/upload-product", upload.single("productImage"), uploadProduct);

module.exports = router;
