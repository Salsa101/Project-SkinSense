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

// CORS
const whitelist = process.env.CORS_WHITELIST
  ? process.env.CORS_WHITELIST.split(",")
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (whitelist.length === 0 || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use("/", routes);
app.use("/admin", adminRoutes);

require("./cron");

app.get("/", (req, res) => {
  res.send("API is running!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
