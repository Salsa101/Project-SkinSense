const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 3000;
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes/router");
const adminRoutes = require("./routes/adminRouter");
const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/", routes);
app.use("/admin", adminRoutes);

require("./cron");

app.get("/", (req, res) => {
  res.send("API is running!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
