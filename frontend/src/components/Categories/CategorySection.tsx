import { CategoryRow } from "./CategoryRow";
import BudgetProgress from "./BudgetProgress";

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
  onBudgetUpdate: (categoryId: number, newBudget: number) => void; // ✅ Added missing prop
}

export function CategorySection({
  budgetGroup,
  aggregatedTotals,
  aggregatedEarnings,
  currentDate,
  onIconChange,
  onBudgetUpdate, // ✅ Receive the function prop
}: CategorySectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4">{budgetGroup.group_name}</h3>

        {budgetGroup.categories.map((category) => (
          <CategoryRow
            key={category.category_id}
            category={category}
            aggregatedTotals={aggregatedTotals}
            aggregatedEarnings={aggregatedEarnings}
            currentDate={currentDate}
            onIconChange={onIconChange}
            onBudgetUpdate={onBudgetUpdate} // ✅ Pass this down to `CategoryRow`
          />
        ))}
      </div>
    </div>
  );
}
