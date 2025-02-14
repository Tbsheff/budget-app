import { Link, useLocation, useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import {
  LayoutDashboard,
  CreditCard,
  PiggyBank,
  Wallet,
  Search,
  LogOut, // ✅ Import Logout Icon
} from "lucide-react";
import { useUser } from "../context/userContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: CreditCard, label: "Spending", path: "/spending" },
  { icon: PiggyBank, label: "Budgets", path: "/budgets" },
  { icon: Wallet, label: "Income", path: "/income" },
  { icon: Search, label: "Transactions", path: "/transactions" },
];

export function Sidebar() {
  const { user, setUser } = useUser(); // ✅ Ensure `setUser` is accessible
  const navigate = useNavigate();
  const location = useLocation();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ Remove auth token
    setUser(null); // ✅ Reset user state
    navigate("/login"); // ✅ Redirect to login page
    setTimeout(() => window.location.reload(), 100); // ✅ Ensure full logout
  };

  // Determine greeting text
  const greeting = user?.first_name
    ? `Hi, ${user.first_name}`
    : user?.email
    ? `Hi, ${user.email.split("@")[0]}`
    : "Hi, Guest (Set your name in Profile)";

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-primary">{greeting}</h2>
        </div>

        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={handleProfileClick}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0..."
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

      {/* Navigation Menu */}
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors 
                ${isActive ? "bg-secondary text-white font-bold" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* 🔥 Logout Button (At the Bottom) */}
      <button
        onClick={handleLogout}
        className="w-full mt-auto flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-300 bg-gray-300 text-gray-800 hover:bg-gray-400"


      >
        <LogOut className="w-5 h-5 mr-3" />
        Log Out
      </button>
    </div>
  );
}
