'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("budget_history", "rolled_over_amount", {
      type: Sequelize.DECIMAL,
      allowNull: true,
      defaultValue: 0.00,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("budget_history", "rolled_over_amount");
  },
};

