const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const PlaidTransactionSync = sequelize.define(
  "plaid_transaction_sync",
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
    plaid_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cursor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    added_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    modified_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    removed_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    last_sync_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
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
    tableName: "plaid_transaction_sync",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = PlaidTransactionSync;