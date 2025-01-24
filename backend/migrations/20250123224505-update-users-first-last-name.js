"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add first_name and last_name
    await queryInterface.addColumn("users", "first_name", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("users", "last_name", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // If needed, populate first_name and last_name from name
    // (Assumes existing data in "name" column)
    await queryInterface.sequelize.query(`
      UPDATE users 
      SET first_name = SUBSTRING_INDEX(name, ' ', 1), 
          last_name = SUBSTRING_INDEX(name, ' ', -1)
      WHERE name IS NOT NULL
    `);

    // Remove the old name column
    await queryInterface.removeColumn("users", "name");
  },

  async down(queryInterface, Sequelize) {
    // Re-add the name column
    await queryInterface.addColumn("users", "name", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Populate the name column from first_name and last_name
    await queryInterface.sequelize.query(`
      UPDATE users 
      SET name = CONCAT(first_name, ' ', last_name)
      WHERE first_name IS NOT NULL AND last_name IS NOT NULL
    `);

    // Remove first_name and last_name
    await queryInterface.removeColumn("users", "first_name");
    await queryInterface.removeColumn("users", "last_name");
  },
};
