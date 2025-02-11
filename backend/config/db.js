const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");
require("dotenv").config();

// Raw SQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || "database_development",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || null,
  {
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
    logging: false,
    dialectModule: false, // Disable logging; set to true for debugging
  },
   
);

module.exports = {
  pool, // Export raw SQL connection pool
  sequelize, // Export Sequelize instance
};
