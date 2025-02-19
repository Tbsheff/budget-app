const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getCategoryAnalytics } = require("../controllers/categoryAnalyticsController");

// Route to fetch analytics for a specific category with optional time range
router.get("/:categoryId/analytics", auth, getCategoryAnalytics);

module.exports = router;
