import { Search, CalendarDays, ShoppingBag, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


interface TransactionFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  dateRange: { from: Date | undefined; to: Date | undefined } | undefined;
  onDateRangeChange: (
    range: { from: Date | undefined; to: Date | undefined } | undefined
  ) => void;
  categories: string[];
}

export function TransactionFilters({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoriesChange,
  dateRange,
  onDateRangeChange,
  categories,
}: TransactionFiltersProps) {
  const handleCategorySelect = (category: string) => {
    if (category === "all") {
      onCategoriesChange(categories);
    } else if (category === "clear") {
      onCategoriesChange([]);
    } else {
      const newCategories = selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category];
      onCategoriesChange(newCategories);
    }
  };

  const getCategoryLabel = () => {
    if (selectedCategories.length === categories.length)
      return "All Categories";
    if (selectedCategories.length === 0) return "No Categories";
    if (selectedCategories.length === 1) return selectedCategories[0];
    return `${selectedCategories.length} Categories`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          
          <Select
            value={
              selectedCategories.length === categories.length
                ? "all"
                : "default"
            }
            onValueChange={handleCategorySelect}
          >
            <SelectTrigger className="w-[200px]">
              <ShoppingBag className="w-4 h-4 mr-2" />
              <SelectValue>{getCategoryLabel()}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="clear">Clear All</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  <div className="flex items-center justify-between w-full">
                    <span>{category}</span>
                    {selectedCategories.includes(category) && (
                      <Check className="h-4 w-4 text-gray-400 ml-2" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
