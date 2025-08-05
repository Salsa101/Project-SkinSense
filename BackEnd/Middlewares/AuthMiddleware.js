const jwt = require("jsonwebtoken");
const { jwtSecret } = require('../config/config');

const validateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Token tidak ditemukan" });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Token tidak valid atau kedaluwarsa" });
  }
};

module.exports = { validateToken };
