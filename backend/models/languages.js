const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Languages = sequelize.define(
  "languages",
  {
    language_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false, // e.g., EN, ES, FR
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // e.g., English, Spanish, French
    },
  },
  {
    tableName: "languages",
    timestamps: false,
  }
);

module.exports = Languages;
