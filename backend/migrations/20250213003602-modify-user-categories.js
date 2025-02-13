'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("user_categories", "budget_group_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "user_budget_groups",
        key: "budget_group_id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("user_categories", "budget_group_id");
  },
};

