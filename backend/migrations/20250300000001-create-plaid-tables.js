const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create plaid_items table
    await queryInterface.createTable("plaid_items", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.BIGINT, // changed from INTEGER to BIGINT to match referenced users table column type
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      access_token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      item_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      institution_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      institution_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "active",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // 2. Create plaid_accounts table
    await queryInterface.createTable("plaid_accounts", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      plaid_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "plaid_items",
          key: "id",
        },
      },
      user_id: {
        type: DataTypes.BIGINT, // changed from INTEGER to BIGINT to match referenced users table column type
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      plaid_account_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      official_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      mask: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subtype: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      available_balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      current_balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      iso_currency_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // 3. Create plaid_transaction_sync table
    await queryInterface.createTable("plaid_transaction_sync", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.BIGINT, // changed from INTEGER to BIGINT to match referenced users table column type
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      plaid_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "plaid_items",
          key: "id",
        },
      },
      cursor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      added_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      modified_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      removed_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      last_sync_date: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop in reverse order
    await queryInterface.dropTable("plaid_transaction_sync");
    await queryInterface.dropTable("plaid_accounts");
    await queryInterface.dropTable("plaid_items");
  },
};