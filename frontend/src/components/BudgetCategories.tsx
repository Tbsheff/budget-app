import { 
  Monitor, 
  Coffee, 
  ShoppingCart, 
  Home, 
  MoreHorizontal,
  Download,
  FileText,
  Trash
} from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

export function BudgetCategories() {
  const { toast } = useToast();
  const [budgetedAmounts, setBudgetedAmounts] = useState(
    categories.reduce((acc, category) => ({
      ...acc,
      [category.name]: category.budgeted
    }), {} as Record<string, number>)
  );

  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [localCategories, setLocalCategories] = useState(categories);

  const handleStartEdit = (categoryName: string) => {
    setEditingCategory(categoryName);
  };

  const handleBlur = () => {
    setEditingCategory(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setEditingCategory(null);
    }
  };

  const handleAmountChange = (categoryName: string, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setBudgetedAmounts(prev => ({
      ...prev,
      [categoryName]: numericValue ? parseInt(numericValue, 10) : 0
    }));
  };

  const handleDeleteCategory = (categoryName: string) => {
    setLocalCategories(prev => prev.filter(cat => cat.name !== categoryName));
    toast({
      title: "Category Deleted",
      description: `${categoryName} has been removed from your budget.`,
    });
  };

  const renderAmount = (category: typeof categories[0]) => {
    if (editingCategory === category.name) {
      return (
        <Input
          type="text"
          value={budgetedAmounts[category.name]}
          onChange={(e) => handleAmountChange(category.name, e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-20 h-8 text-right"
          autoFocus
        />
      );
    }
    return (
      <span 
        className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
        onClick={() => handleStartEdit(category.name)}
      >
        ${budgetedAmounts[category.name]}
      </span>
    );
  };

  const renderCategoryRow = (category: typeof categories[0]) => (
    <div key={category.name} className="flex items-center justify-between group p-3 md:p-0 md:py-2 hover:bg-gray-50 rounded-lg md:rounded-none transition-colors">
      <div className="flex items-center">
        <span className="font-medium text-sm md:text-base">{category.name}</span>
      </div>
      <div className="flex items-center space-x-4 md:space-x-8">
        {renderAmount(category)}
        <button
          onClick={() => handleDeleteCategory(category.name)}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-500 p-1"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold mb-4">BUDGET CATEGORIES</h3>
          <div className="space-y-2 md:space-y-4">
            {localCategories.slice(2).map(renderCategoryRow)}
          </div>
        </div>
      </div>
    </div>
  );
}