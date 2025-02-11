'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('transactions', 'category_id', {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('transactions', 'category_id', {
      type: Sequelize.INTEGER, // Original type (if needed to rollback)
      allowNull: false,
    });
  },
};
