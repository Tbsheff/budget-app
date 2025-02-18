import { useState, useEffect } from "react";
import axios from "axios";
import { DollarSign, Calendar, Wallet, TrendingDown } from "lucide-react";

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  return <BudgetSummary currentDate={currentDate} />;
};

export default Index;
interface BudgetSummaryProps {
  currentDate: Date;
}

export function BudgetSummary({ currentDate }: BudgetSummaryProps) {
  const [total, setTotal] = useState<number>(0);
  const [spent, setSpent] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);
  const [daysLeft, setDaysLeft] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
          .toISOString()
          .split("T")[0];
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
          .toISOString()
          .split("T")[0];

        // Format currentDate as YYYY-MM
        const formattedDate = currentDate.toISOString().slice(0, 7);

        // Fetch user categories with the appropriate month
        const budgetResponse = await axios.get("/api/user-categories", {
          headers: { Authorization: `Bearer ${token}` },
          params: { current_date: formattedDate },
        });

        const totalBudget = budgetResponse.data
          .filter((category: { name: string }) => category.name !== "Earnings")
          .reduce(
            (acc: number, category: { monthly_budget: number }) => acc + category.monthly_budget,
            0
          );

        setTotal(totalBudget);

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
        setRemaining(Math.max(totalBudget - totalSpent, 0));

        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        setDaysLeft(daysInMonth - today.getDate());
      } catch (error) {
        console.error("Error fetching budget or expense data:", error);
      }
    };

    fetchData();
  }, [currentDate]);

  const perDay = daysLeft > 0 ? (remaining / daysLeft).toFixed(2) : "0.00";
  const spentPercentage = total > 0 ? Math.min((remaining / total) * 100, 100) : 0;
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const dashOffset =
    total > 0 ? Math.max(circumference * (1 - spentPercentage / 100), 0) : circumference;

  return (
    <div className="max-w-md mx-auto p-4 pt-0">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4">
          <h2 className="text-gray-800 text-xl font-semibold text-center">
            Monthly Budget Summary
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Progress Circle */}
          <div className="relative flex justify-center mb-8">
            <div className="relative w-36 h-36 md:w-48 md:h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                <circle
                  className="text-gray-100"
                  strokeWidth="12"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="80"
                  cy="80"
                />
                <circle
                  className="text-emerald-500 transition-all duration-500"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="80"
                  cy="80"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs md:text-sm text-gray-500 font-medium">Remaining</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">
                    ${remaining.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">of ${total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid - Modified for mobile responsiveness */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 text-center p-3 bg-blue-50 rounded-2xl transition-all duration-300 hover:bg-blue-100">
              <Wallet className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-lg font-bold text-gray-800">${total.toFixed(2)}</p>
            </div>

            <div className="space-y-1 text-center p-3 bg-red-50 rounded-2xl transition-all duration-300 hover:bg-red-100">
              <TrendingDown className="w-5 h-5 text-red-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-gray-600">Spent</p>
              <p className="text-lg font-bold text-gray-800">${spent.toFixed(2)}</p>
            </div>

            <div className="space-y-1 text-center p-3 bg-green-50 rounded-2xl transition-all duration-300 hover:bg-green-100">
              <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-gray-600">Daily Budget</p>
              <p className="text-lg font-bold text-gray-800">${perDay}</p>
            </div>

            <div className="space-y-1 text-center p-3 bg-purple-50 rounded-2xl transition-all duration-300 hover:bg-purple-100">
              <Calendar className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-gray-600">Days Left</p>
              <p className="text-lg font-bold text-gray-800">{daysLeft}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
