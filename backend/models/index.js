"use strict";

const Sequelize = require("sequelize");
const path = require("path");
const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname, "../config/config.json"))[env];

// Initialize Sequelize connection
const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

// ✅ Explicitly import all models
const Users = require("./users");
const UserSettings = require("./user_settings");
const Currencies = require("./currencies");
const Languages = require("./languages");
const DefaultCategories = require("./default_categories");
const BudgetGroups = require("./budget_groups");
const UserBudgetGroups = require("./user_budget_groups");
const UserCategories = require("./user_categories"); // ✅ Import UserCategories FIRST
const BudgetHistory = require("./budget_history"); // ✅ Import AFTER UserCategories
const UserSubcategories = require("./user_subcategories");
const Transactions = require("./transactions");
const RecurringTransactions = require("./recurring_transactions");
const Income = require("./Income");
const SavingsGoals = require("./savings_goals");
const Survey = require("./survey");
const Notifications = require("./notifications");

// Import Plaid models
const PlaidItems = require("./plaid_items");
const PlaidAccounts = require("./plaid_accounts");
const PlaidTransactionSync = require("./plaid_transaction_sync");

// ✅ Attach models to Sequelize instance
const db = {
  sequelize,
  Sequelize,
  Users,
  UserSettings,
  Currencies,
  Languages,
  DefaultCategories,
  BudgetGroups,
  UserBudgetGroups,
  UserCategories,
  BudgetHistory,
  UserSubcategories,
  Transactions,
  RecurringTransactions,
  Income,
  SavingsGoals,
  Survey,
  Notifications,
  PlaidItems,
  PlaidAccounts,
  PlaidTransactionSync,
};

// ✅ Define Associations

// 🔹 Users -> UserSettings (One-to-One)
Users.hasOne(UserSettings, {
  foreignKey: "user_id",
  as: "settings",
});
UserSettings.belongsTo(Users, {
  foreignKey: "user_id",
  as: "user",
});

// 🔹 Users -> BudgetGroups (One-to-Many)
Users.hasMany(UserBudgetGroups, {
  foreignKey: "user_id",
  as: "budgetGroups",
});
UserBudgetGroups.belongsTo(Users, {
  foreignKey: "user_id",
  as: "user",
});

// 🔹 BudgetGroups -> UserCategories (One-to-Many)
UserBudgetGroups.hasMany(UserCategories, {
  foreignKey: "budget_group_id",
  as: "categories",
});
UserCategories.belongsTo(UserBudgetGroups, {
  foreignKey: "budget_group_id",
  as: "budget_group",
});

// 🔹 UserCategories -> BudgetHistory (One-to-Many)
UserCategories.hasMany(BudgetHistory, {
  foreignKey: "category_id",
  as: "budgetHistory",
});
BudgetHistory.belongsTo(UserCategories, {
  foreignKey: "category_id",
  as: "category",
});

// 🔹 UserCategories -> UserSubcategories (One-to-Many)
UserCategories.hasMany(UserSubcategories, {
  foreignKey: "category_id",
  as: "subcategories",
});
UserSubcategories.belongsTo(UserCategories, {
  foreignKey: "category_id",
  as: "category",
});

// 🔹 UserCategories -> Transactions (One-to-Many)
UserCategories.hasMany(Transactions, {
  foreignKey: "category_id",
  as: "transactions",
});
Transactions.belongsTo(UserCategories, {
  foreignKey: "category_id",
  as: "category",
});

// 🔹 Users -> Transactions (One-to-Many)
Users.hasMany(Transactions, {
  foreignKey: "user_id",
  as: "transactions",
});
Transactions.belongsTo(Users, {
  foreignKey: "user_id",
  as: "user",
});

// 🔹 Users -> RecurringTransactions (One-to-Many)
Users.hasMany(RecurringTransactions, {
  foreignKey: "user_id",
  as: "recurringTransactions",
});
RecurringTransactions.belongsTo(Users, {
  foreignKey: "user_id",
  as: "user",
});

// 🔹 Users -> Income (One-to-Many)
Users.hasMany(Income, {
  foreignKey: "user_id",
  as: "incomes",
});
Income.belongsTo(Users, {
  foreignKey: "user_id",
  as: "user",
});

// 🔹 Users -> SavingsGoals (One-to-Many)
Users.hasMany(SavingsGoals, {
  foreignKey: "user_id",
  as: "savingsGoals",
});
SavingsGoals.belongsTo(Users, {
  foreignKey: "user_id",
  as: "user",
});

// 🔹 Users -> Survey (One-to-One)
Users.hasOne(Survey, {
  foreignKey: "user_id",
  as: "survey",
});
Survey.belongsTo(Users, {
  foreignKey: "user_id",
  as: "user",
});

// 🔹 Users -> Notifications (One-to-Many)
Users.hasMany(Notifications, {
  foreignKey: "user_id",
  as: "notifications",
});
Notifications.belongsTo(Users, {
  foreignKey: "user_id",
  as: "user",
});

// 🔹 Users -> PlaidItems (One-to-Many)
Users.hasMany(PlaidItems, {
  foreignKey: "user_id",
  as: "plaidItems",
});
PlaidItems.belongsTo(Users, {
  foreignKey: "user_id",
  as: "user",
});

// 🔹 PlaidItems -> PlaidAccounts (One-to-Many)
PlaidItems.hasMany(PlaidAccounts, {
  foreignKey: "plaid_item_id",
  as: "accounts",
});
PlaidAccounts.belongsTo(PlaidItems, {
  foreignKey: "plaid_item_id",
  as: "plaidItem",
});

// 🔹 PlaidItems -> PlaidTransactionSync (One-to-Many)
PlaidItems.hasMany(PlaidTransactionSync, {
  foreignKey: "plaid_item_id",
  as: "transactionSyncs",
});
PlaidTransactionSync.belongsTo(PlaidItems, {
  foreignKey: "plaid_item_id",
  as: "plaidItem",
});

// 🔹 Users -> PlaidAccounts (One-to-Many)
Users.hasMany(PlaidAccounts, {
  foreignKey: "user_id",
  as: "plaidAccounts",
});
PlaidAccounts.belongsTo(Users, {
  foreignKey: "user_id",
  as: "user",
});

// 🔹 Currencies and Languages are independent tables
// No direct associations defined for them

// ✅ Export the database object
module.exports = db;
