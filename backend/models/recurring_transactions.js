const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // Adjust path as needed

const Recurring_transactions = sequelize.define(
  "recurring_transactions",
  {
    recurring_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    frequency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    next_occurrence: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "recurring_transactions",
    timestamps: false, // Set to true if `createdAt` and `updatedAt` exist
  }
);

module.exports = Recurring_transactions;
