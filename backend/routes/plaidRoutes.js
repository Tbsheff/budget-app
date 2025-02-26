const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createLinkToken,
  exchangePublicToken,
  getAccounts,
  syncTransactions,
  unlinkAccount
} = require("../controllers/plaidController");

// Create a link token to initialize Plaid Link
router.post("/create-link-token", auth, createLinkToken);

// Exchange public token for access token
router.post("/exchange-token", auth, exchangePublicToken);

// Get all linked accounts
router.get("/accounts", auth, getAccounts);

// Sync transactions for a specific bank connection
router.post("/sync/:itemId?", auth, syncTransactions);

// Unlink a bank connection
router.delete("/accounts/:itemId", auth, unlinkAccount);

module.exports = router;