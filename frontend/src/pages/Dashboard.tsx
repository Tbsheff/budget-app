import { ChevronLeft, ChevronRight, HelpCircle, Menu } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { BudgetCategories } from "@/components/BudgetCategories";
import { BudgetSummary } from "@/components/BudgetSummary";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <h1 className="text-lg font-semibold">January 2025 Budget</h1>
          <HelpCircle className="w-6 h-6 text-gray-500" />
        </div>
      </div>

      <main className="flex-1 p-4 md:p-8 w-full md:mt-0 mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">January 2025 Budget</h1>

            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-white text-gray-900 shadow hover:bg-gray-100 px-4 py-2">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Dec. 2024
              </button>

              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-white text-gray-900 shadow hover:bg-gray-100 px-4 py-2">
                Feb. 2025
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>

              <button className="text-gray-500 hover:text-gray-700">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Month Navigation */}
          <div className="md:hidden flex justify-between items-center mb-6 mt-2">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-white text-gray-900 shadow hover:bg-gray-100 px-3 py-1.5">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Dec
            </button>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-white text-gray-900 shadow hover:bg-gray-100 px-3 py-1.5">
              Feb
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {/* Show Summary First on Mobile */}
            <div className="md:hidden">
              <BudgetSummary />
            </div>

            <div className="md:col-span-2">
              <BudgetCategories />
            </div>

            {/* Hide Summary on Mobile (already shown above) */}
            <div className="hidden md:block">
              <BudgetSummary />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
