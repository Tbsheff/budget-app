const cron = require("node-cron");
const { createMonthlyBudgetSnapshot } = require("./createMonthlyBudgetSnapshot");

// Schedule job: Run at midnight on the 1st of each month
cron.schedule("0 0 1 * *", async () => {
  console.log("⏳ Running monthly budget history snapshot...");
  await createMonthlyBudgetSnapshot();
  console.log("✅ Budget history snapshot completed.");
});

console.log("✅ Monthly budget snapshot cron job scheduled.");
