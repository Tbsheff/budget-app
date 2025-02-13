import { useState } from "react";
import { CategoryRow } from "./CategoryRow";
import BudgetProgress from "./BudgetProgress";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useToast } from "../ui/use-toast";

interface Category {
  category_id: number;
  user_id: number;
  default_category_id?: number;
  name: string;
  monthly_budget: number;
  created_at?: string;
  icon_name: string;
  icon_color: string;
  budget_group: { id: number; group_name: string };
}

interface BudgetGroup {
  id: number;
  group_name: string;
  categories: Category[];
}

interface CategorySectionProps {
  budgetGroup: BudgetGroup;
  aggregatedTotals: Record<number, number>;
  aggregatedEarnings: number;
  currentDate: Date;
  onIconChange: (categoryId: number, newIconName: string) => void;
  onBudgetUpdate: (categoryId: number, newBudget: number) => void;
  onCategoryAdded: (budgetGroupId: number, newCategory: Category) => void; // ✅ New prop
}

export function CategorySection({
  budgetGroup,
  aggregatedTotals,
  aggregatedEarnings,
  currentDate,
  onIconChange,
  onBudgetUpdate,
  onCategoryAdded,
}: CategorySectionProps) {
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const { toast } = useToast();

  const addNewCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/user-categories",
        {
          name: newCategoryName.trim(),
          budget_group_id: budgetGroup.id, // ✅ Ensure this is passed
          monthly_budget: 0,
          icon_name: "MoreHorizontal",
          icon_color: "text-gray-500",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newCategory: Category = response.data;

      onCategoryAdded(budgetGroup.id, newCategory); // ✅ Ensure it's added to the correct group

      toast({ title: "Category Added", description: `"${newCategory.name}" has been created.` });
      setNewCategoryName("");
      setIsCategoryDialogOpen(false);
    } catch (error) {
      console.error("Error adding category:", error);
      toast({ title: "Error", description: "Failed to add category." });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{budgetGroup.group_name}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCategoryDialogOpen(true)}
            className="h-8"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Enter category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addNewCategory}>OK</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {budgetGroup.categories.map((category) => (
          <CategoryRow
            key={category.category_id}
            category={category}
            aggregatedTotals={aggregatedTotals}
            aggregatedEarnings={aggregatedEarnings}
            currentDate={currentDate}
            onIconChange={onIconChange}
            onBudgetUpdate={onBudgetUpdate}
          />
        ))}
      </div>
    </div>
  );
}
