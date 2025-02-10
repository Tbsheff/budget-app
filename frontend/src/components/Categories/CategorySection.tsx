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

interface CategorySectionProps {
  category: Category;
  subcategories: Category[];
  aggregatedTotals: Record<number, number>;
  aggregatedEarnings: number;
  currentDate: Date;
  onIconChange: (categoryId: number, newIconName: string) => void; // ✅ Add this
}

export function CategorySection({
  category,
  subcategories,
  aggregatedTotals,
  aggregatedEarnings,
  currentDate,
  onIconChange, // ✅ Add this
}: CategorySectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4">{category.name}</h3>

        {/* Render Parent Category */}
        <CategoryRow
          category={category}
          aggregatedTotals={aggregatedTotals}
          aggregatedEarnings={aggregatedEarnings}
          currentDate={currentDate}
          onIconChange={onIconChange} // ✅ Pass it correctly
        />

        {/* {subcategories.length > 0 && (
          <div className="mt-4 space-y-2">
            {subcategories.map((sub) => (
              <CategoryRow
                category={sub}
                aggregatedTotals={aggregatedTotals}
                aggregatedEarnings={aggregatedEarnings}
                currentDate={currentDate}
                onIconChange={onIconChange} // ✅ Pass it correctly
              />
            ))}
          </div>
        )} */}
      </div>
    </div>
  );
}
