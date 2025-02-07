"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("survey", {
      survey_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      targetRetirementAge: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      employmentStatus: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      monthlyIncome: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      additionalIncome: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      housingPayment: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      utilities: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      internetAndPhone: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      transportationCosts: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      healthInsurance: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      groceries: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      creditCardDebt: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      otherLoans: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      monthlySavings: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      financialPriorities: {
        type: Sequelize.JSON,  // Storing the array as JSON
        allowNull: false,
      },
      otherPriority: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      desiredMonthlySavings: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("survey");
  },
};
