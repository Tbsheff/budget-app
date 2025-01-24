const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getUserCategories, getBudgetSummary } = require("../controllers/dashboardController");

router.get("/categories", auth, getUserCategories);
router.get("/budget-summary", auth, getBudgetSummary);

module.exports = router;
