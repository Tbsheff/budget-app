import { supabase } from './supabase';

export interface BudgetCategory {
  name: string;
  percentage: number;
  amount: number;
  type: 'needs' | 'wants' | 'savings';
  subcategories?: BudgetCategory[];
}

export interface BudgetPlan {
  totalIncome: number;
  categories: BudgetCategory[];
}

export const generateDefaultBudget = (monthlyIncome: number): BudgetPlan => {
  return {
    totalIncome: monthlyIncome,
    categories: [
      {
        name: 'Needs',
        percentage: 50,
        amount: monthlyIncome * 0.5,
        type: 'needs',
        subcategories: [
          { name: 'Housing', percentage: 30, amount: monthlyIncome * 0.3, type: 'needs' },
          { name: 'Utilities', percentage: 10, amount: monthlyIncome * 0.1, type: 'needs' },
          { name: 'Food', percentage: 10, amount: monthlyIncome * 0.1, type: 'needs' },
        ],
      },
      {
        name: 'Wants',
        percentage: 30,
        amount: monthlyIncome * 0.3,
        type: 'wants',
        subcategories: [
          { name: 'Entertainment', percentage: 15, amount: monthlyIncome * 0.15, type: 'wants' },
          { name: 'Shopping', percentage: 10, amount: monthlyIncome * 0.1, type: 'wants' },
          { name: 'Dining Out', percentage: 5, amount: monthlyIncome * 0.05, type: 'wants' },
        ],
      },
      {
        name: 'Savings',
        percentage: 20,
        amount: monthlyIncome * 0.2,
        type: 'savings',
        subcategories: [
          { name: 'Emergency Fund', percentage: 10, amount: monthlyIncome * 0.1, type: 'savings' },
          { name: 'Investments', percentage: 5, amount: monthlyIncome * 0.05, type: 'savings' },
          { name: 'Debt Repayment', percentage: 5, amount: monthlyIncome * 0.05, type: 'savings' },
        ],
      },
    ],
  };
};

export const saveBudgetToDatabase = async (
  userId: string,
  budget: BudgetPlan
) => {
  const { data, error } = await supabase.from('budgets').insert(
    budget.categories.map((category) => ({
      user_id: userId,
      category: category.name,
      amount: category.amount,
      timeframe: 'monthly',
      goals: [],
      constraints: [],
    }))
  );

  if (error) throw error;
  return data;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};