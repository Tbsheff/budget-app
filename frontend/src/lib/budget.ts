import { supabase } from "./supabase";

// Define BudgetCategory interface
export interface BudgetCategory {
  name: string;
  percentage: number;
  amount: number;
  type: "needs" | "wants" | "savings";
  subcategories?: BudgetCategory[];
  category_id?: string;
}

// Define BudgetPlan interface
export interface BudgetPlan {
  totalIncome: number;
  categories: BudgetCategory[];
}

// Function to generate default budget
export const generateDefaultBudget = (monthlyIncome: number): BudgetPlan => {
  return {
    totalIncome: monthlyIncome,
    categories: [
      {
        name: "Needs",
        percentage: 50,
        amount: monthlyIncome * 0.5,
        type: "needs",
        subcategories: [
          {
            name: "Housing",
            percentage: 30,
            amount: monthlyIncome * 0.3,
            type: "needs",
          },
          {
            name: "Utilities",
            percentage: 10,
            amount: monthlyIncome * 0.1,
            type: "needs",
          },
          {
            name: "Food",
            percentage: 10,
            amount: monthlyIncome * 0.1,
            type: "needs",
          },
        ],
      },
      {
        name: "Wants",
        percentage: 30,
        amount: monthlyIncome * 0.3,
        type: "wants",
        subcategories: [
          {
            name: "Entertainment",
            percentage: 15,
            amount: monthlyIncome * 0.15,
            type: "wants",
          },
          {
            name: "Shopping",
            percentage: 10,
            amount: monthlyIncome * 0.1,
            type: "wants",
          },
          {
            name: "Dining Out",
            percentage: 5,
            amount: monthlyIncome * 0.05,
            type: "wants",
          },
        ],
      },
      {
        name: "Savings",
        percentage: 20,
        amount: monthlyIncome * 0.2,
        type: "savings",
        subcategories: [
          {
            name: "Emergency Fund",
            percentage: 10,
            amount: monthlyIncome * 0.1,
            type: "savings",
          },
          {
            name: "Investments",
            percentage: 5,
            amount: monthlyIncome * 0.05,
            type: "savings",
          },
          {
            name: "Debt Repayment",
            percentage: 5,
            amount: monthlyIncome * 0.05,
            type: "savings",
          },
        ],
      },
    ],
  };
};

// Function to save budget to the database via API
export const saveBudgetToDatabase = async (
  userId: string,
  budget: BudgetPlan
) => {
  const budgetEntries = budget.categories.map((category) => ({
    user_id: userId,
    name: category.name,
    monthly_budget: category.amount,
    icon_name: "default-icon", // You can customize this as needed
    icon_color: "default-color", // You can customize this as needed
  }));

  try {
    for (const entry of budgetEntries) {
      const response = await fetch(
        "http://localhost:5000/api/user-categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(entry),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save budget data.");
      }
    }

    return { message: "Budget saved successfully." };
  } catch (error) {
    console.error("Error saving budget:", error);
    return null;
  }
};

// Function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
