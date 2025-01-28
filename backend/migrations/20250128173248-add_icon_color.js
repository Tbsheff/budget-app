"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("user_categories", "icon_name", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "MoreHorizontal",
    });
    await queryInterface.addColumn("user_categories", "icon_color", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "text-gray-500",
    });

    await queryInterface.addColumn("default_categories", "icon_name", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "MoreHorizontal",
    });
    await queryInterface.addColumn("default_categories", "icon_color", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "text-gray-500",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("user_categories", "icon_name");
    await queryInterface.removeColumn("user_categories", "icon_color");
    await queryInterface.removeColumn("default_categories", "icon_name");
    await queryInterface.removeColumn("default_categories", "icon_color");
  },
};
