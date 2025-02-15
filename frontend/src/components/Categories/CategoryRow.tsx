import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RenderAmount } from "./RenderAmount";
import { IconPicker } from "./IconPicker";
import BudgetProgress from "./BudgetProgress";
import * as LucideIcons from "lucide-react";
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
}

export function CategoryRow({
  category,
  aggregatedTotals,
  aggregatedEarnings,
  currentDate,
  onIconChange,
  onBudgetUpdate,
}: CategoryRowProps) {
  const navigate = useNavigate();

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

  const handleRowClick = () => {
    const formattedDate = currentDate.toISOString();
    navigate(
      `/category/analytics/${category.category_id}?selectedDate=${formattedDate}`
    );
  };

  return (
    <>
      <div
        className="grid grid-cols-[1fr_0.5fr_0.5fr] gap-2 items-center px-2 py-2 border-b cursor-pointer"
        onClick={handleRowClick}
      >
        <div className="flex items-center gap-2">
          <IconComponent className={cn("w-5 h-5", category.icon_color)} />
          <span className="text-sm">{category.name}</span>
        </div>
        <span className="text-center text-sm">
          ${category.monthly_budget.toFixed(2)}
        </span>
        <span className={`text-right text-sm ${amountTextColor}`}>
          ${spentAmount.toFixed(2)}
        </span>
      </div>
      <BudgetProgress actual={spentAmount} budgeted={budgetAmount} />
    </>
  );
}
