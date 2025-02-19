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
  const IconComponent =
    (LucideIcons[category.icon_name as keyof typeof LucideIcons] as React.ElementType) ||
    LucideIcons.MoreHorizontal;

  const spentAmount =
    category.name === "Earnings" ? aggregatedEarnings : aggregatedTotals[category.category_id] || 0;

  const budgetAmount = category.monthly_budget;
  const isOverBudget = spentAmount > budgetAmount;
  const amountTextColor = isOverBudget ? "text-red-500" : "text-green-500";
  const navigate = useNavigate();

  const handleRowClick = () => {
    const formattedDate = currentDate.toISOString();
    navigate(`/category/analytics/${category.category_id}?selectedDate=${formattedDate}`);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div
        className="flex flex-col items-start justify-between group p-3 md:p-0 md:py-2 hover:bg-gray-50 rounded-lg md:rounded-none cursor-pointer"
        onClick={handleRowClick}
      >
        <div className="flex items-center gap-2 w-full">
          {/* Left Section: Icon and Category Name */}
          <div className="flex items-center flex-1">
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
              onClick={stopPropagation} // Pass stopPropagation to IconPicker
            />
            <span className="font-medium text-sm md:text-base ml-3">{category.name}</span>
          </div>

          {/* Right Section: Budget, Spent Amount */}
          <div className="flex items-center space-x-4 md:space-x-8">
            <RenderAmount
              category={category}
              currentDate={currentDate}
              onBudgetUpdate={onBudgetUpdate}
              onClick={stopPropagation} // Pass stopPropagation to RenderAmount
            />
            <span className={`${amountTextColor} text-sm md:text-base`} onClick={stopPropagation}>
              ${spentAmount.toFixed(2)}
            </span>
          </div>
        </div>
        <BudgetProgress actual={spentAmount} budgeted={budgetAmount} />
      </div>
    </>
  );
}
