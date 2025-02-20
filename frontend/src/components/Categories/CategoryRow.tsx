import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RenderAmount } from "./RenderAmount";
import { IconPicker } from "./IconPicker";
import BudgetProgress from "./BudgetProgress";
import * as LucideIcons from "lucide-react";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  category_id: number;
  name: string;
  monthly_budget: number;
  icon_name: string;
  icon_color: string;
}

interface CategoryRowProps {
  category: Category;
  aggregatedTotals: Record<number, number>;
  aggregatedEarnings: number;
  currentDate: Date;
  onIconChange: (categoryId: number, newIconName: string) => void;
  onBudgetUpdate: (categoryId: number, newBudget: number) => void;
  onDeleteCategory: (categoryId: number) => void;
}

export function CategoryRow({
  category,
  aggregatedTotals,
  aggregatedEarnings,
  currentDate,
  onIconChange,
  onBudgetUpdate,
  onDeleteCategory,
}: CategoryRowProps) {
  const IconComponent =
    (LucideIcons[
      category.icon_name as keyof typeof LucideIcons
    ] as React.ElementType) || LucideIcons.MoreHorizontal;

  const spentAmount =
    category.name === "Earnings"
      ? aggregatedEarnings
      : aggregatedTotals[category.category_id] || 0;

  const budgetAmount = category.monthly_budget;
  const isOverBudget = spentAmount > budgetAmount;
  const amountTextColor = isOverBudget ? "text-red-500" : "text-green-500";
  const navigate = useNavigate();
  const isCurrentMonth =
    new Date().toISOString().slice(0, 7) ===
    currentDate.toISOString().slice(0, 7);

  const handleRowClick = () => {
    const formattedDate = currentDate.toISOString();
    navigate(
      `/category/analytics/${category.category_id}?selectedDate=${formattedDate}`
    );
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div
        className="grid grid-cols-[1.5fr_1fr_1fr_0.3fr] gap-4 items-center px-6 py-2 hover:bg-gray-50 rounded-lg md:rounded-none transition-colors group"
        onClick={handleRowClick}
      >
        <div className="flex items-center gap-2">
          <IconPicker
            categoryId={category.category_id}
            value={
              (LucideIcons[
                category.icon_name as keyof typeof LucideIcons
              ] as LucideIcons.LucideIcon) ||
              (LucideIcons.MoreHorizontal as LucideIcons.LucideIcon)
            }
            onChange={(icon) => onIconChange(category.category_id, icon.name)}
            color={category.icon_color}
            onClick={stopPropagation}
            currentDate={currentDate}
          />
          <span className="font-medium text-sm md:text-base ml-3">
            {category.name}
          </span>
        </div>
        <span className="text-center text-sm">
          <RenderAmount
            category={category}
            currentDate={currentDate}
            onBudgetUpdate={onBudgetUpdate}
            onClick={stopPropagation} // Pass stopPropagation to RenderAmount
          />
        </span>
        <span
          className={`text-left text-sm  ${amountTextColor}`}
          onClick={stopPropagation}
        >
          ${spentAmount.toFixed(2)}
        </span>
        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
  <button
    onClick={(e) => {
      e.stopPropagation();
      if (isCurrentMonth) onDeleteCategory(category.category_id);
    }}
    disabled={!isCurrentMonth}
    className="text-gray-400 hover:text-red-500 p-1 disabled:opacity-50"
  >
    <Trash className="w-4 h-4" />
  </button>
</div>

      </div>
      <BudgetProgress actual={spentAmount} budgeted={budgetAmount} />
    </>
  );
}
