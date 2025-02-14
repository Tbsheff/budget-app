const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const { updateCategoryIcon } = require("../controllers/categoryController");
const auth = require("../middleware/authMiddleware");

router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM budget_categories WHERE user_id = ?", [req.user.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:categoryId/icon", auth, updateCategoryIcon);

module.exports = router;