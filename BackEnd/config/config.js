require("dotenv").config();

const dbConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432, // tambahkan port
  logging: process.env.DB_LOGGING === "true",
  dialect: process.env.DB_DIALECT,
  dialectOptions: {
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  },
};

module.exports = {
  development: dbConfig,
  test: dbConfig,
  production: dbConfig,
  jwtSecret: process.env.JWT_SECRET,
};
