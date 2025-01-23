const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getUserCategories, getTransactions } = require("../controllers/dashboardController");

router.get("/categories", auth, getUserCategories);
router.get("/transactions", auth, getTransactions);

module.exports = router;
