const { plaidClient } = require("../config/plaidClient");
const PlaidItems = require("../models/plaid_items");
const PlaidAccounts = require("../models/plaid_accounts");
const PlaidTransactionSync = require("../models/plaid_transaction_sync");
const Transactions = require("../models/transactions");
const UserCategories = require("../models/user_categories");
const { Products } = require("plaid");
const { Op } = require("sequelize");
const { sequelize } = require("../config/db");

// Create a link token for the user to initialize Plaid Link
exports.createLinkToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const clientUserId = userId.toString();

    const request = {
      user: {
        client_user_id: clientUserId,
      },
      client_name: "Budget App",
      products: ["transactions"],
      language: "en",
      country_codes: ["US", "CA"],
      webhook: process.env.PLAID_WEBHOOK_URL,
    };

    const response = await plaidClient.linkTokenCreate(request);
    return res.json(response.data);
  } catch (error) {
    console.error("Error creating link token:", error);
    return res.status(500).json({
      error: error.message || "Failed to create link token",
    });
  }
};

// Exchange the public token for an access token and store it
exports.exchangePublicToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const { public_token, institution } = req.body;

    // Exchange public token for access token
    const tokenResponse = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const accessToken = tokenResponse.data.access_token;
    const itemId = tokenResponse.data.item_id;

    // Get item details including institution
    const itemResponse = await plaidClient.itemGet({
      access_token: accessToken,
    });

    const institutionId = itemResponse.data.item.institution_id || null;

    // Get accounts linked to this item
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    // Store item in database
    // Using a transaction to ensure all related records are created
    const result = await sequelize.transaction(async (transaction) => {
      // Create the Plaid Item record
      const plaidItem = await PlaidItems.create(
        {
          user_id: userId,
          access_token: accessToken,
          item_id: itemId,
          institution_id: institutionId,
          institution_name: institution ? institution.name : null,
          status: "active",
        },
        { transaction }
      );

      // Create account records for each account
      const accounts = accountsResponse.data.accounts;
      const accountRecords = [];

      for (const account of accounts) {
        const plaidAccount = await PlaidAccounts.create(
          {
            plaid_item_id: plaidItem.id,
            user_id: userId,
            plaid_account_id: account.account_id,
            name: account.name,
            official_name: account.official_name,
            mask: account.mask,
            type: account.type,
            subtype: account.subtype,
            available_balance: account.balances.available,
            current_balance: account.balances.current,
            iso_currency_code: account.balances.iso_currency_code,
            is_active: true,
          },
          { transaction }
        );
        accountRecords.push(plaidAccount);
      }

      // Initialize transaction sync for this item
      await PlaidTransactionSync.create(
        {
          user_id: userId,
          plaid_item_id: plaidItem.id,
          cursor: "", // Will be updated after first sync
          added_count: 0,
          modified_count: 0,
          removed_count: 0,
          last_sync_date: new Date(),
        },
        { transaction }
      );

      return {
        plaidItem,
        accounts: accountRecords,
      };
    });

    // Start an initial transaction sync in the background
    this.syncTransactionsForItem(result.plaidItem.id);

    return res.status(201).json({
      success: true,
      message: "Account successfully linked",
      item: result.plaidItem,
      accounts: result.accounts.map(account => ({
        id: account.id,
        name: account.name,
        type: account.type,
        subtype: account.subtype,
        mask: account.mask
      }))
    });
  } catch (error) {
    console.error("Error exchanging public token:", error);
    return res.status(500).json({
      error: error.message || "Failed to link account",
    });
  }
};

// Get all linked accounts for the user
exports.getAccounts = async (req, res) => {
  try {
    const userId = req.user.id;

    const plaidItems = await PlaidItems.findAll({
      where: { user_id: userId, status: "active" },
      include: [{
        model: PlaidAccounts,
        as: "accounts",
        where: { is_active: true },
      }]
    });

    return res.json(plaidItems);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return res.status(500).json({
      error: error.message || "Failed to fetch accounts",
    });
  }
};

// Sync transactions for a specific item
exports.syncTransactionsForItem = async (itemId, userId) => {
  try {
    // If itemId is provided directly, fetch the item first
    let plaidItem;
    if (itemId) {
      plaidItem = await PlaidItems.findByPk(itemId);
      if (!plaidItem) {
        throw new Error("Plaid item not found");
      }
      userId = plaidItem.user_id;
    } else if (userId) {
      // If only userId is provided, sync all items for that user
      const items = await PlaidItems.findAll({
        where: { user_id: userId, status: "active" }
      });
      
      for (const item of items) {
        await this.syncTransactionsForItem(item.id);
      }
      return;
    } else {
      throw new Error("Either itemId or userId must be provided");
    }

    // Get the access token for this item
    const accessToken = plaidItem.access_token;

    // Get or create a sync record for this item
    let syncRecord = await PlaidTransactionSync.findOne({
      where: { plaid_item_id: plaidItem.id }
    });

    if (!syncRecord) {
      syncRecord = await PlaidTransactionSync.create({
        user_id: userId,
        plaid_item_id: plaidItem.id,
        cursor: "",
        added_count: 0,
        modified_count: 0,
        removed_count: 0,
        last_sync_date: new Date(),
      });
    }

    // Set up options for transaction sync
    const options = {
      access_token: accessToken,
      cursor: syncRecord.cursor || undefined,
      count: 500, // Number of transactions to fetch per request
    };

    let hasMore = true;
    let added = [];
    let modified = [];
    let removed = [];
    let nextCursor;

    // Continue syncing until we've fetched all transactions
    while (hasMore) {
      const response = await plaidClient.transactionsSync(options);
      const data = response.data;
      
      // Update cursor for next request
      options.cursor = data.next_cursor;
      nextCursor = data.next_cursor;
      
      // Append new transaction data
      added = added.concat(data.added);
      modified = modified.concat(data.modified);
      removed = removed.concat(data.removed);
      
      // Check if there are more transactions to fetch
      hasMore = data.has_more;
    }

    // Process transactions in a database transaction to ensure consistency
    await sequelize.transaction(async (transaction) => {
      // Handle added transactions
      for (const plaidTx of added) {
        // Get the account ID associated with this transaction
        const account = await PlaidAccounts.findOne({
          where: {
            plaid_account_id: plaidTx.account_id,
            plaid_item_id: plaidItem.id
          },
          transaction
        });

        if (!account) continue;

        // Find a default category or create one if needed
        let category = await UserCategories.findOne({
          where: {
            user_id: userId,
            name: {
              [Op.like]: plaidTx.personal_finance_category?.primary || "Uncategorized"
            }
          },
          transaction
        });

        if (!category) {
          category = await UserCategories.findOne({
            where: { user_id: userId, name: "Uncategorized" },
            transaction
          });

          // If still no category, use the first available user category
          if (!category) {
            category = await UserCategories.findOne({
              where: { user_id: userId },
              transaction
            });
          }
        }

        // Create transaction in our database
        await Transactions.create({
          user_id: userId,
          category_id: category ? category.category_id : null,
          amount: Math.abs(plaidTx.amount), // Plaid uses negative for expenses, positive for income
          description: plaidTx.name,
          transaction_date: plaidTx.date,
          plaid_transaction_id: plaidTx.transaction_id,
          plaid_account_id: account.id,
          created_at: new Date(),
        }, { transaction });
      }

      // Handle modified transactions
      for (const plaidTx of modified) {
        const existingTx = await Transactions.findOne({
          where: { plaid_transaction_id: plaidTx.transaction_id },
          transaction
        });

        if (existingTx) {
          await existingTx.update({
            amount: Math.abs(plaidTx.amount),
            description: plaidTx.name,
            transaction_date: plaidTx.date,
          }, { transaction });
        }
      }

      // Handle removed transactions
      for (const removedTx of removed) {
        await Transactions.destroy({
          where: { plaid_transaction_id: removedTx.transaction_id },
          transaction
        });
      }

      // Update the sync record
      await syncRecord.update({
        cursor: nextCursor,
        added_count: syncRecord.added_count + added.length,
        modified_count: syncRecord.modified_count + modified.length,
        removed_count: syncRecord.removed_count + removed.length,
        last_sync_date: new Date(),
      }, { transaction });
    });

    return {
      added: added.length,
      modified: modified.length,
      removed: removed.length
    };
  } catch (error) {
    console.error("Error syncing transactions:", error);
    throw error;
  }
};

// Manual sync endpoint for user to trigger a sync
exports.syncTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    let result;
    if (itemId) {
      // Check if the item belongs to this user
      const item = await PlaidItems.findOne({
        where: { id: itemId, user_id: userId }
      });

      if (!item) {
        return res.status(403).json({ error: "Access denied" });
      }

      result = await this.syncTransactionsForItem(itemId);
    } else {
      // Sync all items for this user
      result = await this.syncTransactionsForItem(null, userId);
    }

    return res.json({
      success: true,
      message: "Transactions synced successfully",
      stats: result
    });
  } catch (error) {
    console.error("Error in sync transactions endpoint:", error);
    return res.status(500).json({
      error: error.message || "Failed to sync transactions",
    });
  }
};

// Remove bank account link
exports.unlinkAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    // Verify the item belongs to the user
    const item = await PlaidItems.findOne({
      where: { id: itemId, user_id: userId }
    });

    if (!item) {
      return res.status(404).json({
        error: "Item not found or doesn't belong to this user"
      });
    }

    // Call Plaid's remove item endpoint
    await plaidClient.itemRemove({
      access_token: item.access_token
    });

    // Update our database to mark the item as removed
    await item.update({ status: "removed" });

    // Mark all accounts as inactive
    await PlaidAccounts.update(
      { is_active: false },
      { where: { plaid_item_id: itemId } }
    );

    return res.json({
      success: true,
      message: "Account successfully unlinked"
    });
  } catch (error) {
    console.error("Error unlinking account:", error);
    return res.status(500).json({
      error: error.message || "Failed to unlink account"
    });
  }
};