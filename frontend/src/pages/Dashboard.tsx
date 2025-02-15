import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  DollarSign,
  PieChart,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Sidebar } from "@/components/Sidebar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const fetchDashboardAnalytics = async (timeRange) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`/api/dashboard`, {
        params: { timeRange },
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };

type TimeRange = "3M" | "6M" | "1Y" | "ALL";

export default function CategoryAnalytics() {
  const { categoryId } = useParams();
  const [timeRange, setTimeRange] = useState<TimeRange>("3M");
  const [searchParams] = useSearchParams();
  const initialDate = searchParams.get("selectedDate")
    ? new Date(searchParams.get("selectedDate")!)
    : new Date();

  const [currentDate, setCurrentDate] = useState(initialDate);

  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardAnalytics", timeRange], // Updated query key
    queryFn: () => fetchDashboardAnalytics(timeRange),
  });  

  if (isLoading) return <p>Loading analytics...</p>;
  if (error) return <p>Error loading data</p>;

  const {
    category,
    totalSpent,
    budgetAmount,
    remainingBudget,
    percentageUsed,
    monthlyTrend,
    transactions,
    trendLabel,
    spendingTrends,
  } = data || {};

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const timeRangeButtons: { label: string; value: TimeRange }[] = [
    { label: "3 Months", value: "3M" },
    { label: "6 Months", value: "6M" },
    { label: "1 Year", value: "1Y" },
    { label: "All Time", value: "ALL" },
  ];

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  if (!spendingTrends || !spendingTrends.labels || !spendingTrends.data || !spendingTrends.budget) {
    console.error("🚨 Missing spendingTrends data!", spendingTrends);
  }

  const chartData =
    spendingTrends && Array.isArray(spendingTrends.labels) && spendingTrends.labels.length > 0
      ? {
          labels: spendingTrends.labels,
          datasets: [
            {
              label: "Spending",
              data: Array.isArray(spendingTrends.data) ? spendingTrends.data : [],
              borderColor: "rgb(99, 102, 241)",
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              tension: 0.4,
              fill: true,
            },
            {
              label: "Budget",
              data: Array.isArray(spendingTrends.budget) ? spendingTrends.budget : [],
              borderColor: "rgb(156, 163, 175)",
              borderDash: [5, 5],
              tension: 0,
              fill: false,
            },
          ],
        }
      : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `$${value.toFixed(2)}`, // Ensures currency formatting
        },
      },
    },
  };

  if (!chartData || !Array.isArray(chartData.datasets) || chartData.datasets.length === 0) {
    console.error("🚨 Invalid chartData detected!", chartData);
    return <p>Data is not available.</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-500" />
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 rounded-full h-2"
                    style={{ width: `${percentageUsed}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {percentageUsed.toFixed(1)}% of budget used
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Remaining Budget</p>
                  <p className="text-2xl font-bold text-gray-900">${remainingBudget.toFixed(2)}</p>
                </div>
                <PieChart className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-sm text-gray-600 mt-4">
                {remainingBudget > 0 ? "On track" : "Over budget"} for this month
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Monthly Trend</p>
                  <p
                    className={`text-2xl font-bold ${
                      monthlyTrend <= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {monthlyTrend > 0
                      ? `+${monthlyTrend.toFixed(1)}%`
                      : `${monthlyTrend.toFixed(1)}%`}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-sm text-gray-600 mt-4">{data.trendLabel}</p>
            </div>
          </div>

          {/* Spending Trends Graph */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-900">Spending Trends</h2>

                {/* Desktop Time Range Selection */}
                <div className="hidden md:flex space-x-4">
                  {timeRangeButtons.map(({ label, value }) => (
                    <button
                      key={value}
                      onClick={() => setTimeRange(value)}
                      className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                        timeRange === value
                          ? "bg-indigo-100 text-indigo-700 font-medium"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Mobile Time Range Dropdown */}
                <div className="md:hidden w-full sm:w-48">
                  <button
                    onClick={() => setIsTimeRangeOpen(!isTimeRangeOpen)}
                    className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium text-sm"
                  >
                    <span>{timeRangeButtons.find((b) => b.value === timeRange)?.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isTimeRangeOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isTimeRangeOpen && (
                    <div className="absolute right-0 mt-2 w-full sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                      {timeRangeButtons.map(({ label, value }) => (
                        <button
                          key={value}
                          onClick={() => {
                            setTimeRange(value);
                            setIsTimeRangeOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                            timeRange === value ? "text-indigo-600 bg-indigo-50" : "text-gray-700"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6" style={{ height: "400px" }}>
              {chartData && Array.isArray(chartData.datasets) && chartData.datasets.length > 0 ? (
                <Line options={chartOptions} data={chartData} />
              ) : (
                <p>Loading chart...</p>
              )}
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {transactions.map((t, index) => {
                const amount = Number(t.amount) || 0; // Ensure it's a number
                return (
                  <div key={index} className="p-6 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{t.description}</p>
                      <p className="text-sm text-gray-500">
                        <p className="text-sm text-gray-500">
                          {format(parseISO(t.transaction_date), "M/d/yyyy")}
                        </p>
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">${amount.toFixed(2)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
