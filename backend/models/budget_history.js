const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const BudgetHistory = sequelize.define(
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
      type: DataTypes.STRING, // 'YYYY-MM' format for simplicity and efficiency
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
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  },
  {
    tableName: "budget_history",
    timestamps: true,
  }
);

module.exports = BudgetHistory;
