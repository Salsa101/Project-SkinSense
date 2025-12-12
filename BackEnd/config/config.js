require('dotenv').config();

const dbConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  logging: process.env.DB_LOGGING === 'true',
  dialect: process.env.DB_DIALECT,
};

module.exports = {
  development: dbConfig,
  test: dbConfig,
  production: dbConfig,
  jwtSecret: process.env.JWT_SECRET
};