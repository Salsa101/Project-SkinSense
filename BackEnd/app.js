const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes/router");
const adminRoutes = require("./routes/adminRouter");

//Middleware
app.use(express.json());
app.use(cookieParser());

// CORS
const allowedOrigins = [
  "https://skinsense-admin-bgmy4888j-salsa101s-projects.vercel.app", // vercel admin
  "https://skinsense-admin.vercel.app", // deploy nanti
];

// CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Incoming origin:", origin); // <--- log semua origin
      if (!origin) {
        // Jika request tidak punya origin (misal Postman atau server-to-server)
        callback(null, true);
      } else if (allowedOrigins.includes(origin)) {
        callback(null, true); // origin valid
      } else {
        console.warn("❌ Blocked CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // agar cookie bisa dikirim
  })
);

app.use("/", routes);
app.use("/admin", adminRoutes);

require("./cron");

app.get("/", (req, res) => {
  res.send("API is running!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
