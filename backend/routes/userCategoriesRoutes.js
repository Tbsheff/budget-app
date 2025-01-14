const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const UserCategories = require("../models/user_categories");

// Fetch all categories for the authenticated user
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user's info
    const categories = await UserCategories.findAll({
      where: { user_id: userId },
    });

    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
