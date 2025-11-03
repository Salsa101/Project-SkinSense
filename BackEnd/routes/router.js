const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

//Import Controller
const {
  registerController,
  loginController,
  logoutController,
  finishBoarding,
  getUser,
} = require("../Controllers/AuthController");
const {
  getProfile,
  notifToggle,
  updateProfile,
  deleteAccount,
  deleteData,
  changePassword,
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
  getJournalByDate,
  getJournalsByMonth,
} = require("../Controllers/JournalController");
const {
  createReminderTime,
  getAllReminderTimes,
  updateReminderTime,
  toggleReminder,
} = require("../Controllers/ReminderTimeController");
const {
  getScanQuizDetail,
  deleteScan,
} = require("../Controllers/HistoryScanController");
const {
  forgotPassword,
  resetPassword,
} = require("../Controllers/ForgotPasswordController");
const {
  getLatestScan,
  getExpiringSoon,
  getWeeklyTip,
  getRoutineProgress,
} = require("../Controllers/HomeScreenController");
const {
  getReminderNotifications,
  getRoutineProductNotifications,
} = require("../Controllers/NotificationController");
const upload = require("../Middlewares/UploadImage");

//Admin Role
const { isAdmin } = require("../Middlewares/AdminMiddleware");
const {
  uploadFaceController,
  getFaceResultController,
} = require("../Controllers/FaceScanController");
const {
  getScanDetail,
  compareScans,
  getCompareScans,
} = require("../Controllers/CompareScanController");

//Auth
router.post("/register", validateRegister, registerController);
router.post("/login", validateLogin, loginController);
router.post("/logout", validateToken, logoutController);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/finish-onboarding", validateToken, finishBoarding);
router.get("/user", validateToken, getUser);

// Home Page
router.get("/home", validateToken, getProfile);
router.get("/latest-scan", validateToken, getLatestScan);
router.get("/product-expired", validateToken, getExpiringSoon);
router.get("/weekly-tips", validateToken, getWeeklyTip);
router.get("/routine-progress", validateToken, getRoutineProgress);

//Notification
router.get("/reminder-times/notif", validateToken, getReminderNotifications);
router.get(
  "/expiry-product/notif",
  validateToken,
  getRoutineProductNotifications
);

// Profile Page
router.get("/profile/view", validateToken, getProfile);
router.put("/profile/notif", validateToken, notifToggle);
router.put(
  "/profile/update",
  validateToken,
  upload("profile").fields([{ name: "profileImage" }, { name: "bannerImage" }]),
  updateProfile
);
router.put("/change-password", validateToken, changePassword);
router.delete("/delete-account", validateToken, deleteAccount);
router.delete("/delete-data", validateToken, deleteData);

//Routine Product
router.post(
  "/add-routine-products",
  validateToken,
  upload("products").single("productImage"),
  addProductToRoutine
);
router.post(
  "/upload-product",
  upload("products").single("productImage"),
  uploadProduct
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
router.delete("/routine-products/delete", validateToken, deleteRoutineProduct);
router.get("/routine-products/search", validateToken, searchProducts);
router.get("/routine-products/:id", validateToken, getRoutineProduct); // Get detail
router.put(
  "/routine-products/:id",
  validateToken,
  upload("products").single("productImage"),
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
  upload("faces").single("facePhoto"),
  uploadFaceController
);
router.get("/scans", validateToken, getFaceResultController);

//Journal
router.get("/journal/view", validateToken, getJournalByDate);
router.get("/journal/month", validateToken, getJournalsByMonth);
router.post(
  "/journal/add",
  validateToken,
  upload("journals").single("journal_image"),
  addJournal
);
router.get("/journal/view/:id", validateToken, getJournalDetail);
router.put(
  "/journal/update/:id",
  validateToken,
  upload("journals").single("journal_image"),
  updateJournal
);
router.delete("/journal/delete/:id", validateToken, deleteJournal);

//ReminderTimeRoutine
router.post("/reminder-times/add", validateToken, createReminderTime);
router.get("/reminder-times/view", validateToken, getAllReminderTimes);
router.patch("/reminder-times/:timeOfDay", validateToken, updateReminderTime);
router.patch(
  "/reminder-times/:timeOfDay/toggle",
  validateToken,
  toggleReminder
);

//CompareScanRoute
router.get("/compare-scan-detail", validateToken, getScanDetail);
router.post("/compare-scan", validateToken, compareScans);
router.get(
  "/compare-scan/:firstScanId/:secondScanId",
  validateToken,
  getCompareScans
);

//HistoryScan
router.get("/scan-quiz-detail", validateToken, getScanQuizDetail);
router.delete("/scan-detail/:id", validateToken, deleteScan);

//Admin Role
router.get("/check-auth", validateToken, (req, res) => {
  res.json({ message: "Token valid", user: req.user });
});
router.get("/products", validateToken, isAdmin, getRoutineProduct);
router.post("/add-products", validateToken, isAdmin, addProductToRoutine);

module.exports = router;
