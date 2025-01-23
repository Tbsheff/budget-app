const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // Adjust path as needed

const User_categories = sequelize.define(
  "user_categories",
  {
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    default_category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monthly_budget: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "user_categories",
    timestamps: false,
  }
);

module.exports = User_categories;
