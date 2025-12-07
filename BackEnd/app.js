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
app.use(
  cors({
    origin: true, // otomatis menerima origin dari request
    credentials: true, // izinkan cookie
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
