const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { createBudgetGroup, getUserBudgetGroups } = require("../controllers/budgetGroupController");

router.post("/create", auth, createBudgetGroup);
router.get("/", auth, getUserBudgetGroups);

module.exports = router;