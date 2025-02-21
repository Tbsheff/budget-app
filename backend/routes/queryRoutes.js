const express = require("express");
const router = express.Router();
const { executeQuery } = require("../controllers/queryController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, executeQuery);

module.exports = router;