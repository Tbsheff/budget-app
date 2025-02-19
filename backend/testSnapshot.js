const { createMonthlyBudgetSnapshot } = require("./jobs/createMonthlyBudgetSnapshot");

// Run the snapshot function
(async () => {
  console.log("🛠 Running the budget snapshot manually...");
  await createMonthlyBudgetSnapshot();
  console.log("✅ Budget snapshot completed.");
})();
