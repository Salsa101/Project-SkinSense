const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT,
    logging: process.env.DB_LOGGING === "true",
    dialectOptions: {
      ssl:
        process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    },
  }
);

// Tes koneksi
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected to aiven"))
  .catch((err) => console.error("❌ Database connection error:", err));

module.exports = sequelize;
