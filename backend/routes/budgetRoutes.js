import express from "express";
import BudgetHistory from "../models/budget_history.js"; // Only used in backend

const router = express.Router();

const { saveBudget } = require("../controllers/budgetController");

router.post("/save", auth, saveBudget);

// API endpoint to save budget data
router.post("/budget-history", async (req, res) => {
  try {
    const { budgetEntries } = req.body;
    const data = await BudgetHistory.bulkCreate(budgetEntries);
    res.status(201).json(data);
  } catch (error) {
    console.error("Error saving budget:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
