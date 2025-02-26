const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const PlaidAccounts = sequelize.define(
  "plaid_accounts",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    plaid_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    plaid_account_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    official_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mask: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subtype: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    available_balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    current_balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    iso_currency_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    tableName: "plaid_accounts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = PlaidAccounts;