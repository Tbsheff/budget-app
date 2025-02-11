const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // Adjust path as needed

const Default_categories = sequelize.define(
  "default_categories",
  {
    default_category_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "MoreHorizontal", // Default icon if none is assigned
    },
    icon_color: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "text-gray-500", // Default color if none is assigned
    },
  },
  {
    tableName: "default_categories",
    timestamps: false, // Set to true if `createdAt` and `updatedAt` exist
  }
);

module.exports = Default_categories;
