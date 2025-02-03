"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "phone_number", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("users", "language", {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "English",
    });

    await queryInterface.addColumn("users", "currency", {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "USD",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "phone_number");
    await queryInterface.removeColumn("users", "language");
    await queryInterface.removeColumn("users", "currency");
  },
};
