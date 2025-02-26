import api from './api';

export interface PlaidLinkToken {
  link_token: string;
  expiration: string;
  request_id: string;
}

export interface PlaidAccount {
  id: number;
  name: string;
  mask: string;
  type: string;
  subtype: string;
}

export interface PlaidItem {
  id: number;
  institution_name: string;
  status: string;
  accounts: PlaidAccount[];
}

const plaidService = {
  /**
   * Get a Plaid Link token to initialize Plaid Link
   */
  createLinkToken: async (): Promise<PlaidLinkToken> => {
    const response = await api.get('/api/plaid/create-link-token');
    return response.data;
  },

  /**
   * Exchange a public token for an access token after successful Plaid Link flow
   */
  exchangePublicToken: async (
    public_token: string,
    institution: { name: string; institution_id: string }
  ) => {
    const response = await api.post('/api/plaid/exchange-token', {
      public_token,
      institution
    });
    return response.data;
  },

  /**
   * Get all linked Plaid accounts for the user
   */
  getLinkedAccounts: async (): Promise<PlaidItem[]> => {
    const response = await api.get('/api/plaid/accounts');
    return response.data;
  },

  /**
   * Sync transactions for all accounts or a specific account
   */
  syncTransactions: async (itemId?: number) => {
    const url = itemId 
      ? `/api/plaid/sync-transactions/${itemId}` 
      : '/api/plaid/sync-transactions';
      
    const response = await api.post(url);
    return response.data;
  },

  /**
   * Unlink a Plaid account
   */
  unlinkAccount: async (itemId: number) => {
    const response = await api.delete(`/api/plaid/accounts/${itemId}`);
    return response.data;
  }
};

export default plaidService;