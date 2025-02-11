const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware"); // Middleware for authentication
const {
  addIncome,
  getIncomes,
  deleteIncome,
  updateIncome,
  getIncomeById,
  getAggregatedEarnings,
} = require("../controllers/incomeController");

router.get("/aggregated", auth, getAggregatedEarnings); // Fetch aggregated earnings by date range
router.post("/", auth, addIncome); // Add a new income (POST /api/income)
router.get("/", auth, getIncomes); // Get all incomes for a user
router.get("/:id", auth, getIncomeById); // Get a specific income by ID
router.put("/:id", auth, updateIncome);   // Update an income
router.delete("/:id", auth, deleteIncome); // Delete an income

module.exports = router;
