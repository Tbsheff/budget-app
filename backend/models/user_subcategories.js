const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const UserSubcategories = sequelize.define(
  "user_subcategories",
  {
    subcategory_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "user_subcategories",
    timestamps: false,
  }
);
module.exports = UserSubcategories;