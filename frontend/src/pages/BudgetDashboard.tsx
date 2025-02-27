import { ChevronLeft, ChevronRight, HelpCircle, Menu } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { BudgetCategories } from "@/components/BudgetCategories";
import { BudgetSummary } from "@/components/BudgetSummary";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileMenu } from "@/components/mobilemenu";
import { useUser } from "@/context/userContext";
const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const { user } = useUser();
  const userCreatedAt = new Date(user.created_at);

  // Handlers for navigating months
  const handleDateChange = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MobileMenu />
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 p-4 md:p-8 w-full md:mt-0 mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">{`${currentDate.toLocaleString("default", {
              month: "long",
            })} ${currentDate.getFullYear()} Budget`}</h1>

            <div className="flex items-center space-x-4">
              {/* Left Navigation Button */}
              <button
                onClick={() => handleDateChange("prev")}
                disabled={
                  new Date(userCreatedAt.getFullYear(), userCreatedAt.getMonth(), 1) >=
                  new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
                }
                className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-white text-gray-900 shadow hover:bg-gray-100 px-4 py-2 ${new Date(userCreatedAt.getFullYear(), userCreatedAt.getMonth(), 1) >= new Date(currentDate.getFullYear(), currentDate.getMonth(), 1) ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {/* Conditionally render ChevronLeft only if userCreatedAt allows */}
                {new Date(userCreatedAt.getFullYear(), userCreatedAt.getMonth(), 1) <
                  new Date(currentDate.getFullYear(), currentDate.getMonth(), 1) ? (
                  <ChevronLeft className="w-4 h-4 mr-1" />
                ): (
                  <span className="w-4 h-4 mr-1" />
                )}
                {new Intl.DateTimeFormat("default", {
                  month: "long", // Use "long" for full month names
                  year: "numeric", // Display the full year
                }).format(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              </button>

              {/* Right Navigation Button */}
              <button
                onClick={() => handleDateChange("next")}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-white text-gray-900 shadow hover:bg-gray-100 px-4 py-2"
              >
                {new Intl.DateTimeFormat("default", {
                  month: "long", // Full month names
                  year: "numeric", // Include year
                }).format(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>

              <button className="text-gray-500 hover:text-gray-700">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Month Navigation */}
          <div className="md:hidden flex justify-between items-center mb-6 mt-2">
            <button
              onClick={() => handleDateChange("prev")}
              disabled={
                new Date(userCreatedAt.getFullYear(), userCreatedAt.getMonth(), 1) >=
                new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
              }
              className={`inline-flex items-center justify-center rounded-md text-sm font-medium bg-white text-gray-900 shadow hover:bg-gray-100 px-3 py-1.5 ${new Date(userCreatedAt.getFullYear(), userCreatedAt.getMonth(), 1) >= new Date(currentDate.getFullYear(), currentDate.getMonth(), 1) ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {/* Conditionally render ChevronLeft only if userCreatedAt allows */}
              {new Date(userCreatedAt.getFullYear(), userCreatedAt.getMonth(), 1) <
                new Date(currentDate.getFullYear(), currentDate.getMonth(), 1) ? (
                <ChevronLeft className="w-4 h-4 mr-1" />
              ) : (
                <span className="w-4 h-4 mr-1" />
              )}
              {`${new Date(currentDate.getFullYear(), currentDate.getMonth() - 1).toLocaleString(
                "default",
                { month: "short" }
              )}`}
            </button>
            <button
              onClick={() => handleDateChange("next")}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-white text-gray-900 shadow hover:bg-gray-100 px-3 py-1.5"
            >
              {`${new Date(currentDate.getFullYear(), currentDate.getMonth() + 1).toLocaleString(
                "default",
                { month: "short" }
              )}`}
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {/* Show Summary First on Mobile */}
            <div className="md:hidden">
              <BudgetSummary currentDate={currentDate} />
            </div>

            <div className="md:col-span-2">
              <BudgetCategories currentDate={currentDate} />
            </div>

            {/* Hide Summary on Mobile (already shown above) */}
            <div className="hidden md:block">
              <BudgetSummary currentDate={currentDate} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
