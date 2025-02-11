const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

router.get("/", async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM transactions WHERE user_id = ? AND type = 'expense' AND date >= ? AND date <= ?",
      [req.user.id, startDate, endDate]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;