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
      type: DataTypes.STRING, 
      allowNull: false,
    },
    monthly_budget: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    rolled_over_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0.00,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "budget_history",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = BudgetHistory;
