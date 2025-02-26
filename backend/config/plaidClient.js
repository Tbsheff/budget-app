const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
require('dotenv').config();

// Initialize the Plaid client
// Note: You'll need to set PLAID_CLIENT_ID and PLAID_SECRET in your .env file
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox, // Change to 'development' or 'production' when ready
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

module.exports = { plaidClient };