import { useState, useEffect } from "react";
import axios from "axios";

export function BudgetSummary() {
  const [total, setTotal] = useState<number>(0);
  const [spent, setSpent] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);
  const [daysLeft, setDaysLeft] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const currentDate = new Date();
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
          .toISOString()
          .split("T")[0];
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
          .toISOString()
          .split("T")[0];

        // Fetch the total spending budget from user categories (excluding Earnings)
        const budgetResponse = await axios.get("/api/user-categories", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Sum budgets while ignoring the "Earnings" category
        const totalBudget = budgetResponse.data
          .filter((category: { name: string }) => category.name !== "Earnings")
          .reduce(
            (acc: number, category: { monthly_budget: number }) => acc + category.monthly_budget,
            0
          );
        setTotal(totalBudget);

        // Fetch the current spend (aggregated expenses)
        const expensesResponse = await axios.get("/api/expenses/aggregated", {
          headers: { Authorization: `Bearer ${token}` },
          params: { startDate, endDate },
        });

        const totalSpent = expensesResponse.data.reduce(
          (acc: number, expense: { total_amount: string }) =>
            acc + parseFloat(expense.total_amount),
          0
        );
        setSpent(totalSpent);

        // Calculate remaining
        setRemaining(totalBudget - totalSpent);

        // Calculate days left in the month
        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        setDaysLeft(daysInMonth - today.getDate());
      } catch (error) {
        console.error("Error fetching budget or expense data:", error);
      }
    };

    fetchData();
  }, []);

  const perDay = daysLeft > 0 ? (remaining / daysLeft).toFixed(2) : "0.00";

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6">SUMMARY</h3>

      <div className="flex flex-col items-center mb-4 md:mb-6">
        <div className="relative">
          <svg className="w-36 h-36 md:w-48 md:h-48">
            <circle
              className="text-gray-100"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="70"
              cx="96"
              cy="96"
            />
            <circle
              className="text-primary"
              strokeWidth="10"
              strokeDasharray={440}
              strokeDashoffset={440 * (1 - remaining / total)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="70"
              cx="96"
              cy="96"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-xs md:text-sm text-gray-500">Left to Spend</p>
            <p className="text-2xl md:text-3xl font-bold">${remaining.toFixed(2)}</p>
            <p className="text-xs md:text-sm text-gray-500">of ${total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <p className="text-xs md:text-sm text-gray-500 text-center mb-4 md:mb-6">
        That's ${perDay}/day for the next {daysLeft} days of the month.
      </p>

      <div className="space-y-2 md:space-y-3 text-sm md:text-base">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Spending Budget</span>
          <span className="font-semibold">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Current Spend</span>
          <span className="font-semibold">${spent.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Remaining</span>
          <span className="font-semibold text-primary">${remaining.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
