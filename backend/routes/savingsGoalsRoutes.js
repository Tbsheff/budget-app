const express = require("express");
const auth = require("../middleware/authMiddleware")
const router = express.Router();
const { createSavingsGoal,
    getSavingsGoals,
    updateSavingsGoal,

} = require("../controllers/savingsGoalsController");

router.post("/create", auth, createSavingsGoal);
router.get("/", auth, getSavingsGoals);
router.put("/:goal_id", auth, updateSavingsGoal);

module.exports = router;