const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const PlaidItems = sequelize.define(
  "plaid_items",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    access_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    item_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    institution_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    institution_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "plaid_items",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = PlaidItems;