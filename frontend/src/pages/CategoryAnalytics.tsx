import React, { useState, useRef } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { Bar, Line } from "react-chartjs-2";
import axios from "axios";
import { Sidebar } from "@/components/Sidebar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TooltipItem,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const fetchCategoryAnalytics = async (categoryId, timeRange, selectedDate) => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`/api/category/${categoryId}/analytics`, {
      params: { timeRange, selectedDate },
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
type ViewType = "bar" | "line";

export default function CategoryAnalytics() {
  const { categoryId } = useParams();
  const [timeRange, setTimeRange] = useState<TimeRange>("3M");
  const [searchParams] = useSearchParams();
  const initialDate = searchParams.get("selectedDate")
    ? new Date(searchParams.get("selectedDate")!)
    : new Date();

  const [currentDate, setCurrentDate] = useState(initialDate);

  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>("bar");
  const chartRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["categoryAnalytics", categoryId, timeRange, currentDate],
    queryFn: () => fetchCategoryAnalytics(categoryId, timeRange, currentDate),
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

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  if (!spendingTrends || !spendingTrends.labels || !spendingTrends.data || !spendingTrends.budget) {
    console.error("🚨 Missing spendingTrends data!", spendingTrends);
  }

  const timeRangeButtons: { label: string; value: TimeRange }[] = [
    { label: "3 Months", value: "3M" },
    { label: "6 Months", value: "6M" },
    { label: "1 Year", value: "1Y" },
    { label: "All Time", value: "ALL" },
  ];

  const monthlyChanges = spendingTrends.changes.map((change: number) => change.toFixed(0));

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startX.current) return;

    const currentX = e.touches[0].clientX;
    const diff = startX.current - currentX;

    if (Math.abs(diff) > 50) {
      setActiveView(diff > 0 ? "line" : "bar");
      startX.current = null;
    }
  };

  const handleTouchEnd = () => {
    startX.current = null;
  };

  const lineData =
    spendingTrends && Array.isArray(spendingTrends.labels) && spendingTrends.labels.length > 0
      ? {
          labels: spendingTrends.labels,
          datasets: [
            {
              label: "Monthly Expenses",
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

  const barData = {
    labels: spendingTrends.labels,
    datasets: [
      {
        data: spendingTrends.data,
        label: "Monthly Expenses",
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 1,
        borderRadius: 8,
        barPercentage: 0.9,
        categoryPercentage: 0.9,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems: TooltipItem<"line">[]) => {
            if (!tooltipItems.length) return "";
            const index = tooltipItems[0].dataIndex;

            // Use full date labels for parsing
            const fullDateLabel = spendingTrends.fullDateLabels?.[index];

            if (!fullDateLabel) return "Unknown Date";

            try {
              return format(parseISO(fullDateLabel), "MMM yyyy"); // Example: "Jan 2024"
            } catch (error) {
              console.error("Tooltip Date Parse Error:", error);
              return fullDateLabel;
            }
          },
          label: (context: { parsed: { y: number } }) => `$${context.parsed.y.toFixed(0)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: Math.max(...spendingTrends.data) * 1.1, // Adds 20% extra space above the highest bar
        ticks: {
          callback: (value: number) => `$${value.toFixed(0)}`,
        },
        grid: {
          display: false,
        },
      },
    },
    animation: {
      duration: 500,
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems: TooltipItem<"bar">[]) => {
            if (!tooltipItems.length) return "";
            const index = tooltipItems[0].dataIndex;

            // Use full date labels for parsing
            const fullDateLabel = spendingTrends.fullDateLabels?.[index];

            if (!fullDateLabel) return "Unknown Date";

            try {
              return format(parseISO(fullDateLabel), "MMM yyyy"); // Example: "Jan 2024"
            } catch (error) {
              console.error("Tooltip Date Parse Error:", error);
              return fullDateLabel;
            }
          },
          label: (context: { parsed: { y: number } }) => `$${context.parsed.y.toFixed(0)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          padding: 10, // Add padding to prevent overlap with bar labels
          font: {
            size: 12,
          },
        },
      },
      y: {
        display: false,
        suggestedMax: Math.max(...spendingTrends.data) * 1.1,
      },
    },
    animation: {
      onComplete: function (animation: { chart: ChartJS }) {
        const chart = animation.chart;
        const ctx = chart.ctx;
        const dataset = chart.data.datasets[0];
        const meta = chart.getDatasetMeta(0);

        ctx.save();
        ctx.font = "12px Inter";
        ctx.textAlign = "center";

        // Draw monthly amounts and changes
        dataset.data.forEach((value: number, index: number) => {
          const change = monthlyChanges[index];
          const bar = meta.data[index];
          const { x, y, width, height } = bar.getProps(["x", "y", "width", "height"]);

          // Draw monthly amount inside the bar, near the bottom
          ctx.fillStyle = "#FFFFFF"; // White text for contrast
          ctx.fillText(`$${Math.round(value)}`, x, y + height - 10); // Position just above x-axis

          // Draw change amount above the bar (skip first month)
          if (index > 0) {
            const formattedChange = `${change >= 0 ? "+" : ""}$${change}`;
            ctx.fillStyle = change >= 0 ? "#10B981" : "#EF4444";
            ctx.fillText(formattedChange, x, y - 10);
          }
        });

        ctx.restore();
      },
    },
  };

  if (!lineData || !Array.isArray(lineData.datasets) || lineData.datasets.length === 0) {
    console.error("🚨 Invalid lineData detected!", lineData);
    return <p>Data is not available.</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <Link to="/budget" className="inline-flex items-center text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
            <div className="pb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{category}</h1>
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => navigateMonth("prev")}
                    className="p-2 hover:bg-white rounded-md"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="px-4 font-medium text-gray-900">
                    {formatMonthYear(currentDate)}
                  </span>
                  <div className="relative w-8 flex items-center justify-center">
                    {currentDate < new Date(new Date().getFullYear(), new Date().getMonth(), 1) ? (
                      <button
                        onClick={() => navigateMonth("next")}
                        className="p-2 hover:bg-white rounded-md"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    ) : (
                      <div className="w-5 h-5" /> // Invisible placeholder to keep spacing
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Layout Flex Container */}
<div className="min-h-screen bg-gray-50 mt-16 md:mt-0 px-4 sm:px-6 lg:px-8 mx-auto max-w-screen-lg md:max-w-7xl flex flex-col md:flex-row gap-6">

{/* Left Side: Summary Cards & Spending Trends */}
<div className="flex-1 space-y-8">

  {/* Dashboard Title */}


  {/* Summary Cards */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <div className="bg-purple-500 rounded-full h-2" style={{ width: `${percentageUsed}%` }} />
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
          <p className={`text-2xl font-bold ${monthlyTrend <= 0 ? "text-green-600" : "text-red-600"}`}>
            {monthlyTrend > 0 ? `+${monthlyTrend.toFixed(1)}%` : `${monthlyTrend.toFixed(1)}%`}
          </p>
        </div>
        <BarChart3 className="w-8 h-8 text-blue-500" />
      </div>
      <p className="text-sm text-gray-600 mt-4">{data.trendLabel}</p>
    </div>
  </div>

  {/* Spending Trends Graph */}
  <div className="bg-white rounded-lg shadow">
    <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h2 className="text-xl font-semibold text-gray-900">Spending Trends</h2>

      {/* Time Range Selection Buttons */}
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
    </div>

    {/* Chart Container (Toggleable Bar and Line Chart) */}
    <div
      ref={chartRef}
      className="relative p-6"
      style={{ height: "400px" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Bar Chart (Toggles) */}
      <div className={`transition-opacity duration-500 absolute inset-0 ${activeView === "bar" ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
        <Bar options={barOptions} data={barData} />
      </div>

      {/* Line Chart (Toggles) */}
      <div className={`transition-opacity duration-500 absolute inset-0 ${activeView === "line" ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
        <Line options={lineOptions} data={lineData} />
      </div>
    </div>

    {/* View Toggle Indicators */}
    <div className="flex justify-center items-center gap-3 py-4">
      <button
        onClick={() => setActiveView("bar")}
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          activeView === "bar" ? "bg-indigo-600" : "border-2 border-indigo-600"
        }`}
        aria-label="Show bar chart"
      />
      <button
        onClick={() => setActiveView("line")}
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          activeView === "line" ? "bg-indigo-600" : "border-2 border-indigo-600"
        }`}
        aria-label="Show line chart"
      />
    </div>
  </div>
</div>

{/* Right Side: Recent Transactions */}
<div className="w-full md:w-1/3 flex-shrink-0 mt-32">
  <div className="bg-white rounded-lg shadow">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
    </div>
    <div className="divide-y divide-gray-200">
      {transactions.slice(0, 6).map((t, index) => {
        const amount = Number(t.amount) || 0;
        return (
          <div key={index} className="p-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{t.description}</p>
              <p className="text-sm text-gray-500">{format(parseISO(t.transaction_date), "M/d/yyyy")}</p>
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
      </div>
    </div>
  );
}
