const express = require("express");
const { analyzeReceipt } = require("../controllers/receiptController");

const router = express.Router();

// Define the POST route for invoice analysis
router.post("/analyze", analyzeReceipt);

module.exports = router;
