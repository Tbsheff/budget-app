import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  RefreshCcw,
  CreditCard,
  PiggyBank,
  Wallet,
  Search,
  BadgePercent,
  Target,
} from "lucide-react";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: CreditCard, label: "Spending", path: "/spending" },
  { icon: PiggyBank, label: "Budgets", path: "/dashboard", active: true },
  { icon: Target, label: "Savings Plan", path: "/savings" },
  { icon: Wallet, label: "Income", path: "/income" },
  { icon: Search, label: "Transactions", path: "/transactions" },
];

export function Sidebar() {
  const { user } = useUser(); // Get user data from context
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  // Determine greeting text
  const greeting = user?.first_name
    ? `Hi, ${user.first_name}`
    : user?.email
      ? `Hi, ${user.email.split("@")[0]}`
      : "Hi, Guest (Set your name in Profile)";

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 p-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-primary">{greeting}</h2>
          <span className="ml-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
            1
          </span>
        </div>

        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={handleProfileClick}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              item.active
                ? "bg-secondary text-primary"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-gray-200">
        <blockquote className="text-sm text-gray-500 italic">
          "The pessimist sees difficulty in every opportunity. The optimist sees
          opportunity in every difficulty."
        </blockquote>
        <p className="mt-2 text-sm text-gray-400">Winston Churchill</p>
      </div>
    </div>
  );
}
