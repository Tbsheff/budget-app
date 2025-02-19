'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("budget_history", "total_spent");
  },

  down: async (queryInterface, Sequelize) => {
    // This is the rollback operation, in case you need to undo the migration.
    return queryInterface.addColumn("budget_history", "total_spent", {
      type: Sequelize.DECIMAL,
      allowNull: true,
      defaultValue: 0.00,
    });
  },
};
