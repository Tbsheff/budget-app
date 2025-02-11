import { useState } from "react";
import { Search, CalendarDays, ShoppingBag, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";

interface TransactionFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  viewMode: "month" | "year";
  onViewModeChange: (mode: "month" | "year") => void;
  categories: string[];
}

export function TransactionFilters({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoriesChange,
  selectedDate,
  onDateChange,
  viewMode,
  onViewModeChange,
  categories,
}: TransactionFiltersProps) {
  const [tempYear, setTempYear] = useState(selectedDate.getFullYear());

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border border-gray-300 bg-white text-black"
          />
        </div>

        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-[200px] flex items-center justify-between px-4 py-2 border border-gray-300 rounded shadow-sm bg-white text-black">
              <CalendarDays className="w-4 h-4 mr-2" />
              {viewMode === "month"
                ? `${format(selectedDate, "MMMM")} ${selectedDate.getFullYear()}`
                : selectedDate.getFullYear()}
            </button>
          </PopoverTrigger>
          <PopoverContent className="p-4 bg-white text-black border border-gray-300">
            {viewMode === "month" ? (
              <>
                {/* Year Selector Above Months */}
                <div className="flex justify-between items-center mb-2">
                  <button
                    className="text-gray-700 px-2"
                    onClick={() => setTempYear(tempYear - 1)}
                  >
                    ◀
                  </button>
                  <span className="font-semibold">{tempYear}</span>
                  <button
                    className="text-gray-700 px-2"
                    onClick={() => setTempYear(tempYear + 1)}
                  >
                    ▶
                  </button>
                </div>

                {/* Month Grid */}
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 12 }, (_, i) => (
                    <button
                      key={i}
                      className={`px-4 py-2 rounded ${
                        selectedDate.getMonth() === i && selectedDate.getFullYear() === tempYear
                          ? "bg-primary text-white" // System color
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      onClick={() => onDateChange(new Date(tempYear, i))}
                    >
                      {format(new Date(0, i), "MMM")}
                    </button>
                  ))}
                </div>

                {/* Toggle Button to Year View */}
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => onViewModeChange("year")}
                    className="text-primary"
                  >
                    Filter by Year
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Year Selection Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 12 }, (_, i) => {
                    const year = selectedDate.getFullYear() - 5 + i;
                    return (
                      <button
                        key={year}
                        className={`px-4 py-2 rounded ${
                          selectedDate.getFullYear() === year ? "bg-primary text-white" : "bg-gray-200 hover:bg-gray-300"
                        }`}
                        onClick={() => onDateChange(new Date(year, 0))}
                      >
                        {year}
                      </button>
                    );
                  })}
                </div>

                {/* Toggle Button to Month View */}
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => onViewModeChange("month")}
                    className="text-primary"
                  >
                    Filter by Month
                  </button>
                </div>
              </>
            )}
          </PopoverContent>
        </Popover>

        {/* Category Filter */}
        <Select
          value={selectedCategories.length === categories.length ? "all" : "default"}
          onValueChange={(value) => {
            if (value === "all") onCategoriesChange(categories);
            else if (value === "clear") onCategoriesChange([]);
          }}
        >
          <SelectTrigger className="w-[200px] border border-gray-300 bg-white text-black">
            <ShoppingBag className="w-4 h-4 mr-2" />
            <SelectValue>
              {selectedCategories.length === categories.length
                ? "All Categories"
                : selectedCategories.join(", ")}
            </SelectValue>
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
  );
}
