const express = require("express");
const router = express.Router();
const { getLanguages, getCurrencies } = require("../controllers/settingsController");

// Route to get all available languages
router.get("/languages", getLanguages);

// Route to get all available currencies
router.get("/currencies", getCurrencies);

module.exports = router;
