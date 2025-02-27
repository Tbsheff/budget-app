import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { CategorySection } from "./Categories/CategorySection";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Category {
  category_id: number;
  user_id: number;
  default_category_id?: number;
  name: string;
  monthly_budget: number;
  created_at?: string;
  icon_name: string;
  icon_color: string;
  budget_group: {
    id: number;
    group_name: string;
  };
}

interface BudgetGroup {
  id: number;
  group_name: string;
  categories: Category[];
}

interface BudgetCategoriesProps {
  currentDate: Date;
}

export function BudgetCategories({ currentDate }: BudgetCategoriesProps) {
  const { toast } = useToast();
  const [budgetGroups, setBudgetGroups] = useState<BudgetGroup[]>([]);
  const [aggregatedTotals, setAggregatedTotals] = useState<Record<number, number>>({});
  const [aggregatedEarnings, setAggregatedEarnings] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  useEffect(() => {
    const fetchBudgetGroupsAndCategories = async () => {
      try {
        const token = localStorage.getItem("token");

        // ✅ Fetch user-specific budget groups
        const budgetGroupsResponse = await axios.get("/api/budget-groups", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userBudgetGroups = budgetGroupsResponse.data;

        // Format currentDate as YYYY-MM
        const formattedDate = currentDate.toISOString().slice(0, 7);

        // Fetch user categories with the appropriate month
        const userCategoriesResponse = await axios.get("/api/user-categories", {
          headers: { Authorization: `Bearer ${token}` },
          params: { current_date: formattedDate },
        });

        const userCategories = userCategoriesResponse.data;
        console.log("Current Date", formattedDate);
        console.log("Fetched User Categories:", userCategories);

        // ✅ Ensure all budget groups exist, even if empty
        const groupedCategories: Record<number, BudgetGroup> = {};
        userBudgetGroups.forEach((group) => {
          groupedCategories[group.budget_group_id] = {
            id: group.budget_group_id,
            group_name: group.group_name,
            categories: [],
          };
        });

        // ✅ Assign categories to the correct budget groups
        userCategories.forEach((category) => {
          const groupId = category.budget_group?.budget_group_id;
          if (!groupId) return;

          if (groupedCategories[groupId]) {
            groupedCategories[groupId].categories.push(category);
          } else {
            console.warn("Category has an invalid budget group:", category);
          }
        });

        setBudgetGroups(Object.values(groupedCategories));
        console.log("Updated Budget Groups State:", Object.values(groupedCategories));
      } catch (error) {
        console.error("Error fetching budget groups and categories:", error);
        toast({
          title: "Error",
          description: "Could not fetch budget groups and categories.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetGroupsAndCategories();
  }, [currentDate]);

  useEffect(() => {
    const fetchAggregatedTotalsAndEarnings = async () => {
      try {
        const token = localStorage.getItem("token");

        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
          .toISOString()
          .split("T")[0]; // Format YYYY-MM-DD
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
          .toISOString()
          .split("T")[0];

        // Fetch Expenses
        const expensesResponse = await axios.get(`/api/expenses/aggregated`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { startDate, endDate },
        });

        const expenseTotals = expensesResponse.data.reduce(
          (acc: Record<number, number>, item: { category_id: number; total_amount: string }) => {
            acc[item.category_id] = parseFloat(item.total_amount) || 0;
            return acc;
          },
          {}
        );

        setAggregatedTotals(expenseTotals);

        // Fetch Earnings
        const earningsResponse = await axios.get(`/api/incomes/aggregated`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { startDate, endDate },
        });

        const totalEarnings = earningsResponse.data.total_amount
          ? parseFloat(earningsResponse.data.total_amount)
          : 0;
        setAggregatedEarnings(totalEarnings);
      } catch (error) {
        console.error("❌ Error fetching totals:", error);
        toast({
          title: "Error",
          description: "Could not fetch transaction or earnings totals.",
        });
      }
    };

    fetchAggregatedTotalsAndEarnings();
  }, [currentDate]);

  const addNewBudgetGroup = async () => {
    if (!newGroupName.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/budget-groups/create",
        { group_name: newGroupName.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBudgetGroups((prev) => [...prev, { ...response.data, categories: [] }]); // Add new group to UI
      setNewGroupName(""); // Clear input field
      setIsGroupDialogOpen(false); // Close dialog

      toast({ title: "Success", description: "New budget group created!" });
    } catch (error) {
      console.error("Error creating budget group:", error);
      toast({ title: "Error", description: "Could not create budget group." });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Button
        onClick={() => setIsGroupDialogOpen(true)}
        variant="outline"
        className={`mb-4 w-full ${
          currentDate.toISOString().slice(0, 7) !== new Date().toISOString().slice(0, 7)
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
        disabled={currentDate.toISOString().slice(0, 7) !== new Date().toISOString().slice(0, 7)}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add New Budget Group
      </Button>

      <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Category Group</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Enter group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGroupDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addNewBudgetGroup}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {budgetGroups.map((budgetGroup) => (
        <CategorySection
          key={budgetGroup.id}
          budgetGroup={budgetGroup}
          aggregatedTotals={aggregatedTotals}
          aggregatedEarnings={aggregatedEarnings}
          currentDate={currentDate}
          onIconChange={(categoryId, newIconName) => {
            setBudgetGroups((prevGroups) =>
              prevGroups.map((group) =>
                group.id === budgetGroup.id
                  ? {
                      ...group,
                      categories: group.categories.map((category) =>
                        category.category_id === categoryId
                          ? { ...category, icon_name: newIconName }
                          : category
                      ),
                    }
                  : group
              )
            );
          }}
          onBudgetUpdate={(categoryId, newBudget) => {
            setBudgetGroups((prevGroups) =>
              prevGroups.map((group) =>
                group.id === budgetGroup.id
                  ? {
                      ...group,
                      categories: group.categories.map((category) =>
                        category.category_id === categoryId
                          ? { ...category, monthly_budget: newBudget }
                          : category
                      ),
                    }
                  : group
              )
            );
          }}
          onCategoryAdded={(budgetGroupId, newCategory) => {
            setBudgetGroups((prevGroups) =>
              prevGroups.map((group) =>
                group.id === budgetGroupId
                  ? { ...group, categories: [...group.categories, newCategory] }
                  : group
              )
            );
          }}
        />
      ))}
    </div>
  );
}
