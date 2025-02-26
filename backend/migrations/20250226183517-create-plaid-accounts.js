'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('PlaidAccounts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      plaid_item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      plaid_account_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      official_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mask: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subtype: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      available_balance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      current_balance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      iso_currency_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('PlaidAccounts');
  }
};
