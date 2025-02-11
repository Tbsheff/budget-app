import { useState } from "react";
import { Input } from "../ui/input";

interface Category {
  category_id: number;
  monthly_budget: number;
}

interface RenderAmountProps {
  category: Category;
  currentDate: Date;
}

export function RenderAmount({ category, currentDate }: RenderAmountProps) {
  const [editing, setEditing] = useState(false);
  const budgetAmount = category?.monthly_budget ?? 0; // Ensure a default value

  return editing ? (
    <Input
      type="text"
      value={budgetAmount.toFixed(2)}
      onBlur={() => setEditing(false)}
      className="w-20 h-8 text-right"
      autoFocus
    />
  ) : (
    <span
      className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
      onClick={() => setEditing(true)}
    >
      ${budgetAmount.toFixed(2)}
    </span>
  );
}
