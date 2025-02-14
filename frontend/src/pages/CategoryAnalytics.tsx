import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Calendar, PieChart, BarChart3, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

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

interface Transaction {
  date: string;
  amount: number;
  description: string;
}

// Mock data for the line chart
const mockMonthlyData = {
  labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
  datasets: [
    {
      label: 'Spending',
      data: [320, 280, 350, 390, 420, 380],
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      tension: 0.4,
      fill: true
    },
    {
      label: 'Budget',
      data: [400, 400, 400, 400, 400, 400],
      borderColor: 'rgb(156, 163, 175)',
      borderDash: [5, 5],
      tension: 0,
      fill: false
    }
  ]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: number) => `$${value}`
      }
    }
  }
};

// This would come from your backend
const mockTransactions: Transaction[] = [
  { date: '2025-02-15', amount: 150.00, description: 'Gas Station' },
  { date: '2025-02-12', amount: 200.00, description: 'Car Insurance' },
  { date: '2025-02-08', amount: 50.00, description: 'Car Wash' },
];

type TimeRange = '1M' | '3M' | '6M' | '1Y' | 'ALL';

export default function CategoryAnalytics() {
  const { category } = useParams();
  const [timeRange, setTimeRange] = useState<TimeRange>('6M');
  const [currentDate, setCurrentDate] = useState(new Date(2025, 1));
  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);
  
  const totalSpent = mockTransactions.reduce((sum, t) => sum + t.amount, 0);
  const budgetAmount = 400;
  const remaining = budgetAmount - totalSpent;
  const percentageUsed = (totalSpent / budgetAmount) * 100;

  const timeRangeButtons: { label: string; value: TimeRange }[] = [
    { label: '1 Month', value: '1M' },
    { label: '3 Months', value: '3M' },
    { label: '6 Months', value: '6M' },
    { label: '1 Year', value: '1Y' },
    { label: 'All Time', value: 'ALL' },
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          <div className="pb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{category} Analytics</h1>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-white rounded-md transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <span className="px-4 font-medium text-gray-900">
                  {formatMonthYear(currentDate)}
                </span>
                <button 
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-white rounded-md transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
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
              <p className="text-sm text-gray-600 mt-2">{percentageUsed.toFixed(1)}% of budget used</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Remaining Budget</p>
                <p className="text-2xl font-bold text-gray-900">${remaining.toFixed(2)}</p>
              </div>
              <PieChart className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-sm text-gray-600 mt-4">
              {remaining > 0 ? 'On track' : 'Over budget'} for this month
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Monthly Trend</p>
                <p className="text-2xl font-bold text-gray-900">-12%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-sm text-gray-600 mt-4">Compared to last month</p>
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
                        ? 'bg-indigo-100 text-indigo-700 font-medium'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                  <span>{timeRangeButtons.find(b => b.value === timeRange)?.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isTimeRangeOpen ? 'transform rotate-180' : ''}`} />
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
                          timeRange === value ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700'
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
          <div className="p-6" style={{ height: '400px' }}>
            <Line options={chartOptions} data={mockMonthlyData} />
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {mockTransactions.map((transaction, index) => (
              <div key={index} className="p-6 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
                <p className="font-semibold text-gray-900">${transaction.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}