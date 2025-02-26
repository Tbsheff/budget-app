const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PlaidAccounts = sequelize.define('PlaidAccounts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  plaid_item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
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
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

PlaidAccounts.associate = (models) => {
  PlaidAccounts.belongsTo(models.PlaidItems, {
    foreignKey: 'plaid_item_id',
    as: 'plaidItem',
  });
};

module.exports = PlaidAccounts;