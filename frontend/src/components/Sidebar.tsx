import { Link, useLocation, useNavigate } from "react-router-dom"; // imports useNavigate
import {
  LayoutDashboard,
  CreditCard,
  PiggyBank,
  Wallet,
  Search,
  BadgeDollarSign,
  LogOut, //  Logout Icon
  Target,
} from "lucide-react";
import { useUser } from "../context/userContext";
import { supabase } from "@/config/supabaseClient"; // Import Supabase client

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: CreditCard, label: "Transactions", path: "/spending" },
  { icon: PiggyBank, label: "Budgets", path: "/budget" },
  { icon: Target, label: "Savings Plan", path: "/savings" },
  { icon: Wallet, label: "Add Income", path: "/income" },
  { icon: BadgeDollarSign, label: "Add Transactions", path: "/transactions" },
];

export function Sidebar() {
  const { user, setUser } = useUser(); // ensure `setUser` is accessible
  const navigate = useNavigate();
  const location = useLocation();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogout = async () => {
    try {
      // Log out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Remove auth token and reset user state
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
      setTimeout(() => window.location.reload(), 100); // Full logout
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  // Determine greeting text
  const greeting = user?.first_name
    ? `Hi, ${user.first_name}`
    : user?.email
      ? `Hi, ${user.email.split("@")[0]}`
      : "Hi, Guest (Set your name in Profile)";

  return (
    <div className="sticky top-0 h-screen overflow-y-auto bg-white border-r border-gray-200 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-primary">{greeting}</h2>
        </div>

        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={handleProfileClick}
          aria-label="Open profile menu"
          title="Open profile menu"
          aria-haspopup="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 text-gray-600 hover:text-gray-800 transition-all duration-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M6 20v-2c0-2.5 3.5-4 6-4s6 1.5 6 4v2" />
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

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full mt-auto flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-300 bg-gray-300 text-gray-800 hover:bg-gray-400"
        aria-label="Log out of your account"
        title="Log out of your account"
      >
        <LogOut className="w-5 h-5 mr-3" aria-hidden="true" />
        Log Out
      </button>
    </div>
  );
}
