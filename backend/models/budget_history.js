const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // Adjust path as needed

const Budget_history = sequelize.define(
  "budget_history",
  {
    history_id: {
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
    month_year: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    monthly_budget: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    total_spent: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "budget_history",
    timestamps: false, // Set to true if `createdAt` and `updatedAt` exist
  }
);

module.exports = Budget_history;
