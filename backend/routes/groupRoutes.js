const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getDistinctBudgetGroups } = require("../controllers/budgetGroupController");

router.get("/user", auth, getDistinctBudgetGroups);

module.exports = router;