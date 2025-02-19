'use strict';

/** @type {import('sequelize-cli').Migration} */
  module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn("user_categories", "is_deleted", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
  
      await queryInterface.addColumn("user_categories", "deleted_at", {
        type: Sequelize.DATE,
        allowNull: true, // Null means it's still active
      });
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn("user_categories", "is_deleted");
      await queryInterface.removeColumn("user_categories", "deleted_at");
    },
  };
  
