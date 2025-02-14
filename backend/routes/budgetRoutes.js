const express = require('express');
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { saveBudget } = require("../controllers/budgetGroupController");
//const { BudgetHistory } = require("../models/budget_history");

router.post("/save", auth, saveBudget);

// API endpoint to save budget data
// router.post("/budget-history", async (req, res) => {
//   try {
//     const { budgetEntries } = req.body;
//     const data = await BudgetHistory.bulkCreate(budgetEntries);
//     res.status(201).json(data);
//   } catch (error) {
//     console.error("Error saving budget:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });
module.exports = router;
