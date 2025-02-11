"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add or modify columns in the `budget_history` table
    await queryInterface.changeColumn("budget_history", "month_year", {
      type: Sequelize.STRING, // Change from DATE to STRING ('YYYY-MM' format)
      allowNull: false,
    });

    await queryInterface.changeColumn("budget_history", "created_at", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });

    await queryInterface.addColumn("budget_history", "updated_at", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
    });

    // Optional: Modify the total_spent column if needed
    await queryInterface.changeColumn("budget_history", "total_spent", {
      type: Sequelize.DECIMAL,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Reverse changes if needed
    await queryInterface.changeColumn("budget_history", "month_year", {
      type: Sequelize.DATE,
      allowNull: false,
    });

    await queryInterface.changeColumn("budget_history", "created_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.removeColumn("budget_history", "updated_at");
  },
};
