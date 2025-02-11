const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Currencies = sequelize.define(
  "currencies",
  {
    currency_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false, // e.g., USD, EUR
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // e.g., US Dollar, Euro
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false, // e.g., $, €
    },
  },
  {
    tableName: "currencies",
    timestamps: false,
  }
);

module.exports = Currencies;
