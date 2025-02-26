import api from './api';

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  transaction_date: string;
  plaid_transaction_id: string;
  category_id: number | null;
}

const transactionService = {
  getTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get('/api/transactions');
    return response.data;
  },
  updateTransactionCategory: async (transactionId: number, categoryId: number) => {
    const response = await api.patch(`/api/transactions/${transactionId}`, { category_id: categoryId });
    return response.data;
  }
};

export default transactionService;
