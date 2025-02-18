import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { CategorySection } from "./Categories/CategorySection";

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

  useEffect(() => {
    const fetchBudgetGroups = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch User Categories
        const userCategoriesResponse = await axios.get<Category[]>("/api/user-categories", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (
          userCategoriesResponse.headers["content-type"]?.includes("application/json")
        ) {
          console.log("User Categories:", userCategoriesResponse.data);

          // Group categories by budget group
          const groupedCategories = userCategoriesResponse.data.reduce(
            (acc, category) => {
              const groupId = category.budget_group.id;
              if (!acc[groupId]) {
                acc[groupId] = {
                  id: groupId,
                  group_name: category.budget_group.group_name,
                  categories: [],
                };
              }
              acc[groupId].categories.push(category);
              return acc;
            },
            {} as Record<number, BudgetGroup>
          );

          setBudgetGroups(Object.values(groupedCategories));
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching user categories:", error);
        toast({
          title: "Error",
          description: "Could not fetch user categories.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetGroups();
  }, []);

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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
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
        />
      ))}
    </div>
  );
}
