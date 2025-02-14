const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getUserBudgetGroups } = require("../controllers/budgetGroupController");

router.get("/", auth, getUserBudgetGroups);

module.exports = router;