import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { Input } from "./ui/input";
import * as LucideIcons from "lucide-react"; // Import all Lucide icons (eventually we should make a list and narrow it down)

// Define the Category type
interface Category {
  category_id: number;
  user_id: number;
  default_category_id?: number;
  name: string;
  monthly_budget: number;
  created_at?: string;
  icon_name: string;
  icon_color: string;
}

interface BudgetCategoriesProps {
  currentDate: Date;
}

export function BudgetCategories({ currentDate }: BudgetCategoriesProps) {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [aggregatedTotals, setAggregatedTotals] = useState<Record<number, number>>({});
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [originalBudgets, setOriginalBudgets] = useState<Record<number, number>>({});

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<Category[]>("/api/user-categories", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sanitizedCategories = response.data.map((category) => ({
          ...category,
          monthly_budget: parseFloat(category.monthly_budget.toString()) || 0,
        }));

        setCategories(sanitizedCategories);
        setOriginalBudgets(
          sanitizedCategories.reduce((acc, category) => {
            acc[category.category_id] = category.monthly_budget;
            return acc;
          }, {} as Record<number, number>)
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "Could not fetch categories.",
        });
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch aggregated totals for the selected date range
  useEffect(() => {
    const fetchAggregatedTotals = async () => {
      try {
        const token = localStorage.getItem("token");

        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
          .toISOString()
          .split("T")[0]; // Format YYYY-MM-DD
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
          .toISOString()
          .split("T")[0];

        console.log("🔹 Fetching transactions for:", { startDate, endDate });

        const response = await axios.get(`/api/expenses/aggregated`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { startDate, endDate },
        });

        console.log("🔹 API Response:", response.data);

        const totals = response.data.reduce(
          (acc: Record<number, number>, item: { category_id: number; total_amount: string }) => {
            acc[item.category_id] = parseFloat(item.total_amount) || 0;
            return acc;
          },
          {}
        );

        setAggregatedTotals(totals);
      } catch (error) {
        console.error("❌ Error fetching aggregated totals:", error);
        toast({
          title: "Error",
          description: "Could not fetch transaction totals.",
        });
      }
    };

    fetchAggregatedTotals();
  }, [currentDate]);

  // Start editing a category
  const handleStartEdit = (categoryId: number) => {
    console.log(`Clicked on category ID: ${categoryId}`);
    setEditingCategory(categoryId);
  };

  // editing submission
  const handleBlur = (categoryId: number) => {
    const category = categories.find((cat) => cat.category_id === categoryId);
    if (category) {
      handleSaveBudget(categoryId, category.monthly_budget);
    }
    setEditingCategory(null);
  };

  // Handle `Enter` keypress
  const handleKeyDown = (e: React.KeyboardEvent, categoryId: number) => {
    if (e.key === "Enter") {
      handleBlur(categoryId);
    }
  };

  // Handle budget input changes
  const handleBudgetChange = (categoryId: number, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.category_id === categoryId ? { ...cat, monthly_budget: numericValue } : cat
      )
    );
  };

  // Save the updated budget to the backend
  const handleSaveBudget = async (categoryId: number, newBudget: number) => {
    if (originalBudgets[categoryId] === newBudget) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/user-categories/${categoryId}`,
        { monthly_budget: newBudget },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOriginalBudgets((prev) => ({ ...prev, [categoryId]: newBudget }));
      toast({
        title: "Success",
        description: "Budget updated successfully.",
      });
    } catch (error) {
      console.error("Error updating budget:", error);
      toast({
        title: "Error",
        description: "Could not update budget.",
      });
    }
  };

  const renderCategoryRow = (category: Category) => {
    const IconComponent =
      (LucideIcons[category.icon_name as keyof typeof LucideIcons] as React.ElementType) ||
      LucideIcons.MoreHorizontal;
    const spentAmount = aggregatedTotals[category.category_id] || 0;
    const budgetAmount = category.monthly_budget;
    const isOverBudget = spentAmount > budgetAmount;
    const amountTextColor = isOverBudget ? "text-red-500" : "text-green-500";

    return (
      <div
        key={category.category_id}
        className="flex items-center justify-between group p-3 md:p-0 md:py-2 hover:bg-gray-50 rounded-lg md:rounded-none transition-colors"
      >
        {/* Left Section: Icon and Category Name */}
        <div className="flex items-center space-x-3 md:space-x-4">
          <IconComponent className={`w-5 h-5 ${category.icon_color}`} />
          <span className="font-medium text-sm md:text-base">{category.name}</span>
        </div>

        {/* Right Section: Budget, Spent Amount */}
        <div className="flex items-center space-x-4 md:space-x-8">
          {renderAmount(category)}
          <span className={`${amountTextColor} text-sm md:text-base`}>
            ${spentAmount.toFixed(2)}
          </span>
        </div>
      </div>
    );
  };

  // Render the budget input or formatted value
  const renderAmount = (category: Category) => {
    if (editingCategory === category.category_id) {
      return (
        <Input
          type="text"
          value={category.monthly_budget}
          onChange={(e) => handleBudgetChange(category.category_id, e.target.value)}
          onBlur={() => handleBlur(category.category_id)}
          onKeyDown={(e) => handleKeyDown(e, category.category_id)}
          className="w-20 h-8 text-right"
          autoFocus
        />
      );
    }
    return (
      <span
        className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
        onClick={(e) => {
          e.stopPropagation(); // Prevent event bubbling
          handleStartEdit(category.category_id);
        }}
      >
        ${category.monthly_budget.toFixed(2)}
      </span>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Budget Basics Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold mb-4">BUDGET BASICS</h3>
          <div className="space-y-2 md:space-y-4">
            {categories
              .filter((category) =>
                ["Earnings", "Housing", "Bills & Utilities"].includes(category.name)
              )
              .sort((a, b) => {
                const order = ["Earnings", "Housing", "Bills & Utilities"];
                return order.indexOf(a.name) - order.indexOf(b.name); // Sort by the defined order
              })
              .map(renderCategoryRow)}
          </div>
        </div>
      </div>

      {/* Budget Categories Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold mb-4">BUDGET CATEGORIES</h3>
          <div className="space-y-2 md:space-y-4">
            {categories
              .filter(
                (category) => !["Earnings", "Bills & Utilities", "Housing"].includes(category.name)
              )
              .sort((a, b) => a.name.localeCompare(b.name)) // 🔹 Sort alphabetically by name
              .map(renderCategoryRow)}
          </div>
        </div>
      </div>
    </div>
  );
}
