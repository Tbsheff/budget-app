import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  DollarSign,
  ShoppingCart,
} from "lucide-react";
import axios from "axios";

export function DashboardPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const session = useSelector(
    (state: { session: { token: string } }) => state.session
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session.token) {
      navigate("/login"); // Redirect to login if token is missing
      return;
    }
    const fetchData = async () => {
      try {
        const { data: categoriesData } = await axios.get("/api/categories", {
          headers: { Authorization: `Bearer ${session.token}` },
        });

        const firstDayOfMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        );
        const lastDayOfMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        );

        const { data: transactionsData } = await axios.get(
          "/api/transactions",
          {
            headers: { Authorization: `Bearer ${session.token}` },
            params: {
              startDate: firstDayOfMonth.toISOString(),
              endDate: lastDayOfMonth.toISOString(),
            },
          }
        );

        const categoriesWithSpent = (categoriesData || []).map((category) => {
          const spent = (transactionsData || [])
            .filter((t) => t.category_id === category.id)
            .reduce((sum, t) => sum + Number(t.amount), 0);

          return {
            ...category,
            spent,
          };
        });

        setCategories(categoriesWithSpent);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, currentDate]);

  const getMonthYear = () => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(currentDate);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getTotalBudget = () => {
    return categories.reduce((sum, cat) => sum + Number(cat.monthly_limit), 0);
  };

  const getTotalSpent = () => {
    return categories.reduce((sum, cat) => sum + Number(cat.spent), 0);
  };

  const getRemaining = () => {
    return getTotalBudget() - getTotalSpent();
  };

  const getDaysRemaining = () => {
    const today = new Date();
    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    return Math.max(lastDay.getDate() - today.getDate() + 1, 0);
  };

  const getDailyBudget = () => {
    const remaining = getRemaining();
    const days = getDaysRemaining();
    return days > 0 ? remaining / days : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {getMonthYear()} Budget
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => navigateMonth("next")}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Budget Basics */}
          <div className="bg-white rounded-xl shadow-sm mb-8">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                BUDGET BASICS
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-green-500 mr-3" />
                    <span>Earnings</span>
                  </div>
                  <div className="flex items-center space-x-8">
                    <span>${getTotalBudget().toFixed(2)}</span>
                    <span className="text-gray-500">
                      ${getTotalSpent().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Categories */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                BUDGET CATEGORIES
              </h2>
              {categories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No budget categories yet. Add some categories to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: category.color }}
                        >
                          <ShoppingCart className="h-4 w-4 text-white" />
                        </div>
                        <span className="ml-3">{category.name}</span>
                      </div>
                      <div className="flex items-center space-x-8">
                        <span>${category.monthly_limit.toFixed(2)}</span>
                        <span className="text-green-500">
                          ${category.spent.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm sticky top-8">
            <div className="p-6">
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <svg className="w-32 h-32" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                      strokeDasharray={`${
                        getTotalBudget()
                          ? (getTotalSpent() / getTotalBudget()) * 100
                          : 0
                      }, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold">
                      ${getRemaining().toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">Left to Spend</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Spending Budget</span>
                  <span className="font-semibold">
                    ${getTotalBudget().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Spend</span>
                  <span className="font-semibold">
                    ${getTotalSpent().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Remaining</span>
                  <span className="font-semibold text-green-500">
                    ${getRemaining().toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 text-center">
                  That's ${getDailyBudget().toFixed(2)}/day for the next{" "}
                  {getDaysRemaining()} days of the month.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
