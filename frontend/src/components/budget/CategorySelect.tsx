
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/budget";

interface Category {
  category_id: string;
  name: string;
  monthly_budget: number;
  budget_group_id: string;
}

interface CategorySelectProps {
  categories: Category[];
  selectedGroupId: string;
  selectedCategoryId: string | null;
  selectedCategoryName: string;
  onCategorySelect: (categoryId: string, categoryName: string) => void;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  categories,
  selectedGroupId,
  selectedCategoryId,
  selectedCategoryName,
  onCategorySelect,
}) => {
  const filteredCategories = categories.filter(
    (category) => category.budget_group_id === selectedGroupId
  );

  return (
    <div className="space-y-4">
      <Label>Select a category</Label>
      <Select 
        onValueChange={(value) => {
          const category = categories.find(c => c.category_id === value);
          onCategorySelect(value, category?.name || "");
        }}
        value={selectedCategoryId || undefined}
      >
        <SelectTrigger>
          <SelectValue placeholder="Choose a category" />
        </SelectTrigger>
        <SelectContent>
          {filteredCategories && filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <SelectItem key={category.category_id} value={category.category_id}>
                {category.name} ({formatCurrency(category.monthly_budget)})
              </SelectItem>
            ))
          ) : (
            <SelectItem value="" disabled>
              No categories available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      {selectedCategoryName && (
        <p className="text-sm text-purple-600">Selected: {selectedCategoryName}</p>
      )}
    </div>
  );
};
