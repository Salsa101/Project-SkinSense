const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

//Import Controller
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
  searchProducts,
} = require("../Controllers/RoutineProductController");
const {
  getNews,
  getNewsDetail,
  bookmarkNews,
  unbookmarkNews,
  listBookmarks,
  getCategory,
  getNewsByCategory,
} = require("../Controllers/NewsController");
const {
  getQuestions,
  submitAnswers,
} = require("../Controllers/QuizController");
const {
  addJournal,
  getJournalDetail,
  updateJournal,
  deleteJournal,
} = require("../Controllers/JournalController");
const upload = require("../Middlewares/UploadImage");

//Admin Role
const { isAdmin } = require("../Middlewares/AdminMiddleware");
const { uploadFaceController } = require("../Controllers/FaceScanController");

//Auth
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
router.post("/upload-product", upload.single("productImage"), uploadProduct);
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
router.delete("/routine-products/delete", validateToken, deleteRoutineProduct);
router.get("/routine-products/search", validateToken, searchProducts);
router.get("/routine-products/:id", validateToken, getRoutineProduct); // Get detail
router.put(
  "/routine-products/:id",
  validateToken,
  upload.single("productImage"),
  updateRoutineProduct
);

//News Route
router.get("/news", getNews);
router.get("/news/bookmarks", validateToken, listBookmarks);
router.get("/news/:id", getNewsDetail);
router.post("/news/:newsId/bookmark", validateToken, bookmarkNews);
router.delete("/news/:newsId/bookmark", validateToken, unbookmarkNews);
router.get("/categories", validateToken, getCategory);
router.get("/news/category/:categoryId", getNewsByCategory);

//Skin Quiz
router.get("/question", validateToken, getQuestions);
router.post("/answer", validateToken, submitAnswers);

//FaceScan
router.post(
  "/upload-face",
  validateToken,
  upload.single("facePhoto"),
  uploadFaceController
);

//Journal
router.post(
  "/journal/add",
  validateToken,
  upload.single("journal_image"),
  addJournal
);
router.get("/journal/view/:id", validateToken, getJournalDetail);
router.put(
  "/journal/update/:id",
  validateToken,
  upload.single("journal_image"),
  updateJournal
);
router.delete("/journal/delete/:id", validateToken, deleteJournal);

//Admin Role
router.get("/check-auth", validateToken, (req, res) => {
  res.json({ message: "Token valid", user: req.user });
});
router.get("/products", validateToken, isAdmin, getRoutineProduct);
router.post("/add-products", validateToken, isAdmin, addProductToRoutine);

module.exports = router;
