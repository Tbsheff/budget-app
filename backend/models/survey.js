const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Survey = sequelize.define(
  "Survey",
  {
    survey_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    targetRetirementAge: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    employmentStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monthlyIncome: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    additionalIncome: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    housingPayment: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    utilities: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    internetAndPhone: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    transportationCosts: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    healthInsurance: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    groceries: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    creditCardDebt: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    otherLoans: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    monthlySavings: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    financialPriorities: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    otherPriority: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    desiredMonthlySavings: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "survey",
    timestamps: true, 
  }
);

module.exports = Survey;
