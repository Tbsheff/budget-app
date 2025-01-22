const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware"); // Middleware for authentication
const {
  addIncome,
  getIncomes,
  deleteIncome,
  updateIncome,
  getIncomeById,
} = require("../controllers/incomeController");

// Add new income (POST /api/income)
router.post("/", auth, addIncome);

// Get all incomes (GET /api/income)
router.get("/", auth, getIncomes);

// Get income by ID (GET /api/income/:id)
router.get("/:id", auth, getIncomeById);

// Update an income by ID (PUT /api/income/:id)
router.put("/:id", auth, updateIncome);

// Delete an income by ID (DELETE /api/income/:id)
router.delete("/:id", auth, deleteIncome);

module.exports = router;
