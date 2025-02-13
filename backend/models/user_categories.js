const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User_budget_groups = require("./user_budget_groups"); // Reference updated

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
      type: DataTypes.BIGINT,
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
      get() {
        const value = this.getDataValue("monthly_budget");
        return value === null ? null : parseFloat(value);
      },
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
    budget_group_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
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

User_categories.belongsTo(User_budget_groups, {
    foreignKey: "budget_group_id",
    as: "budget_group",
});

module.exports = User_categories;
