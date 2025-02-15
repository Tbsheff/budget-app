const express = require("express");
const auth = require("../middleware/authMiddleware")
const router = express.Router();
const { createSavingsGoal,
    getSavingsGoals,

} = require("../controllers/savingsGoalsController");

router.post("/create", auth, createSavingsGoal);
router.get("/", auth, getSavingsGoals);

module.exports = router;