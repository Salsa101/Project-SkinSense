const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;
require('dotenv').config();

const routes = require("./routes/router");

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use("/", routes);

app.get("/", (req, res) => {
  res.send("API is running!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
