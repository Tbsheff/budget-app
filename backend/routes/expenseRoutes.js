const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware"); // Import middleware
const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

// Routes
router.get("/", auth, getExpenses); // Fetch all expenses for the authenticated user
router.get("/:id", auth, getExpenseById); // Fetch a specific expense by ID
router.post("/", auth, createExpense); // Create a new expense
router.put("/:id", auth, updateExpense); // Update an existing expense
router.delete("/:id", auth, deleteExpense); // Delete an expense

module.exports = router;
