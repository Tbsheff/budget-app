export type TransactionType = "expense" | "income";

export interface Transaction {
  id: number;
  date: Date;
  name: string;
  category: string;
  amount: number;
  type: TransactionType;
}
