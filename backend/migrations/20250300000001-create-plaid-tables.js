"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create plaid_items table
    await queryInterface.createTable("plaid_items", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      access_token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      item_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      institution_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      institution_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "active",
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });

    // Create plaid_transaction_sync table
    await queryInterface.createTable("plaid_transaction_sync", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      plaid_item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "plaid_items",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      cursor: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      added_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      modified_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      removed_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      last_sync_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order
    await queryInterface.dropTable("plaid_transaction_sync");
    await queryInterface.dropTable("plaid_items");
  },
};
