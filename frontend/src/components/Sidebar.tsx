import { Link, useLocation, useNavigate } from "react-router-dom"; // imports useNavigate
import {
  LayoutDashboard,
  CreditCard,
  PiggyBank,
  Wallet,
  Search,
  BadgeDollarSign ,
  LogOut, //  Logout Icon
} from "lucide-react";
import { useUser } from "../context/userContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: CreditCard, label: "Spending", path: "/spending" },
  { icon: PiggyBank, label: "Budgets", path: "/budgets" },
  { icon: Wallet, label: "Income", path: "/income" },
  { icon: BadgeDollarSign , label: "Transactions", path: "/transactions" },
];

export function Sidebar() {
  const { user, setUser } = useUser(); // ensure `setUser` is accessible
  const navigate = useNavigate();
  const location = useLocation();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove auth token
    setUser(null); // reset user state
    navigate("/login"); // redirect to login page
    setTimeout(() => window.location.reload(), 100); //  full logout
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


      >
        <LogOut className="w-5 h-5 mr-3" />
        Log Out
      </button>
    </div>
  );
}
