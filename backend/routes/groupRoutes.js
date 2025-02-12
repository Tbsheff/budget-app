const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { createBudgetGroup } = require("../controllers/budgetGroupController");

router.post("/create", auth, createBudgetGroup);

module.exports = router;