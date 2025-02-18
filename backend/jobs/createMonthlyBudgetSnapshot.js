const { Op } = require("sequelize");
const UserCategories = require("../models/user_categories");
const BudgetHistory = require("../models/budget_history");
const Transactions = require("../models/transactions");

async function createMonthlyBudgetSnapshot() {
  try {
    console.log("Checking if last month's budget snapshot is needed...");

    // Get the previous month's date
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    const lastMonthYear = now.toISOString().slice(0, 7); // Format: YYYY-MM

    // Check if the snapshot already exists
    const existingRecords = await BudgetHistory.count({
      where: { month_year: lastMonthYear },
    });

    if (existingRecords > 0) {
      console.log(`✅ Budget snapshot for ${lastMonthYear} already exists.`);
      return;
    }

    console.log(`🔄 No snapshot found for ${lastMonthYear}. Creating now...`);

    // Fetch all active or recently deleted categories
    const categories = await UserCategories.findAll({
      where: {
        [Op.or]: [
          { is_deleted: false }, // Active categories
          { deleted_at: { [Op.gte]: `${lastMonthYear}-01` } }, // Deleted after last month started
        ],
      },
      attributes: ["user_id", "category_id", "monthly_budget"],
    });

    const historyRecords = [];

    for (const category of categories) {
      // Fetch the previous month's budget from `budget_history`
      const previousBudget = await BudgetHistory.findOne({
        where: {
          user_id: category.user_id,
          category_id: category.category_id,
          month_year: lastMonthYear,
        },
        attributes: ["monthly_budget"],
      });

      // Calculate total spent in the previous month
      const totalSpent = await Transactions.sum("amount", {
        where: {
          user_id: category.user_id,
          category_id: category.category_id,
          transaction_date: {
            [Op.between]: [`${lastMonthYear}-01`, `${lastMonthYear}-31`], // Transactions for last month
          },
        },
      });

      const previousBudgetAmount = previousBudget ? previousBudget.monthly_budget : 0;
      const rolloverAmount = Math.max(0, previousBudgetAmount - (totalSpent || 0)); // Prevent negative rollovers

      historyRecords.push({
        user_id: category.user_id,
        category_id: category.category_id,
        month_year: lastMonthYear,
        monthly_budget: category.monthly_budget,
        rolled_over_amount: rolloverAmount,
        created_at: new Date(),
      });
    }

    if (historyRecords.length > 0) {
      await BudgetHistory.bulkCreate(historyRecords);
      console.log(`✅ Inserted ${historyRecords.length} budget history records.`);
    } else {
      console.log(`ℹ️ No budget records to insert.`);
    }
  } catch (error) {
    console.error("❌ Error creating budget snapshot:", error);
  }
}

module.exports = { createMonthlyBudgetSnapshot };
