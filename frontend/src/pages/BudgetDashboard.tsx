import { ChevronLeft, ChevronRight, HelpCircle, Menu } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { BudgetCategories } from "@/components/BudgetCategories";
import { BudgetSummary } from "@/components/BudgetSummary";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date()); // Added state to manage the current date

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
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Sheet>
            <SheetTrigger>
              <Menu className="w-6 h-6 text-gray-600" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-semibold">{`${currentDate.toLocaleString("default", {
            month: "long",
          })} ${currentDate.getFullYear()} Budget`}</h1>
          <HelpCircle className="w-6 h-6 text-gray-500" />
        </div>
      </div>

      <main className="flex-1 p-4 md:p-8 w-full md:mt-0 mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">{`${currentDate.toLocaleString("default", {
              month: "long",
            })} ${currentDate.getFullYear()} Budget`}</h1>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleDateChange("prev")}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-white text-gray-900 shadow hover:bg-gray-100 px-4 py-2"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                {new Intl.DateTimeFormat("default", {
                  month: "long", // Use "long" for full month names or "short" if you want abbreviations.
                  year: "numeric", // Display the full year
                }).format(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              </button>

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
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-white text-gray-900 shadow hover:bg-gray-100 px-3 py-1.5"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
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
