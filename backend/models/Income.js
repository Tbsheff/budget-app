const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // Adjust path as needed

const Income = sequelize.define(
  "income",
  {
    income_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    frequency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pay_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    next_pay_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "income_sources",
    timestamps: false, // Set to true if `createdAt` and `updatedAt` exist
  }
);

module.exports = Income;
