const express = require('express');
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { saveBudget } = require("../controllers/budgetGroupController");
const { getUserCategories, getBudgetSummary, updateBudget } = require("../controllers/budgetController");

router.post("/save", auth, saveBudget);
router.get("/categories", auth, getUserCategories);
router.post("/update", auth, updateBudget);
router.get("/budget-summary", auth, getBudgetSummary);

module.exports = router;
