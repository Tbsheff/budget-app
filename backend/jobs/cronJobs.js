const cron = require("node-cron");
const { createMonthlyBudgetSnapshot } = require("./createMonthlyBudgetSnapshot");
const { syncTransactionsForItem } = require("../controllers/plaidController");
const PlaidItems = require("../models/plaid_items");

// Schedule job: Run at midnight on the 1st of each month
cron.schedule("0 0 1 * *", async () => {
  console.log("⏳ Running monthly budget history snapshot...");
  await createMonthlyBudgetSnapshot();
  console.log("✅ Budget history snapshot completed.");
});

// Schedule job: Sync Plaid transactions every hour
cron.schedule("0 * * * *", async () => {
  try {
    console.log("⏳ Starting Plaid transaction sync...");
    const items = await PlaidItems.findAll({
      where: { status: "active" }
    });

    for (const item of items) {
      try {
        await syncTransactionsForItem(item.id);
        console.log(`✅ Synced transactions for item ${item.id}`);
      } catch (error) {
        console.error(`❌ Error syncing transactions for item ${item.id}:`, error);
      }
    }
    console.log("✅ Plaid transaction sync completed.");
  } catch (error) {
    console.error("❌ Error in Plaid transaction sync job:", error);
  }
});

console.log("✅ Monthly budget snapshot cron job scheduled.");
console.log("✅ Plaid transaction sync cron job scheduled.");
