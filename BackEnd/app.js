const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;
require('dotenv').config();

const routes = require("./routes/router");
const path = require("path");

// app.use("/uploads", express.static("uploads"));
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use("/", routes);

app.get("/", (req, res) => {
  res.send("API is running!");
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
