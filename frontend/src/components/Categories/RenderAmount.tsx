import { useState } from "react";
import { Input } from "../ui/input";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { format } from "date-fns";

interface Category {
  category_id: number;
  monthly_budget: number;
}

interface RenderAmountProps {
  category: Category;
  currentDate: Date;
  onBudgetUpdate: (categoryId: number, newBudget: number) => void;
  onClick?: (e: React.MouseEvent) => void; // Add onClick to props
}

export function RenderAmount({
  category,
  currentDate,
  onBudgetUpdate,
  onClick,
}: RenderAmountProps) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(category.monthly_budget.toFixed(2));

  // Determine if editing is allowed based on date
  const isEditable = () => {
    const today = new Date();
    return (
      currentDate.getFullYear() > today.getFullYear() ||
      (currentDate.getFullYear() === today.getFullYear() &&
        currentDate.getMonth() == today.getMonth())
    );
  };

  // Handle budget input changes (fixes backspace issue)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Handle blur and save if value changed
  const handleBlur = async () => {
    setEditing(false);
    const newBudget = parseFloat(inputValue);

    if (isNaN(newBudget) || newBudget < 0) {
      setInputValue(category.monthly_budget.toFixed(2));
      return;
    }

    if (category.monthly_budget !== newBudget) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `/api/user-categories/${category.category_id}`,
          { monthly_budget: newBudget },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        onBudgetUpdate(category.category_id, newBudget);
        toast({ title: "Success", description: "Budget updated successfully." });
      } catch (error) {
        console.error("Error updating budget:", error);
        toast({ title: "Error", description: "Could not update budget." });
        setInputValue(category.monthly_budget.toFixed(2)); // Reset on failure
      }
    }
  };

  return isEditable() ? (
    editing ? (
      <Input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={(e) => e.key === "Enter" && handleBlur()}
        className="w-20 h-8 text-right"
        autoFocus
        onClick={onClick} // Use onClick prop
      />
    ) : (
      <span
        className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
        onClick={(e) => {
          setEditing(true);
          if (onClick) onClick(e); // Call onClick prop
        }}
      >
        ${category.monthly_budget.toFixed(2)}
      </span>
    )
  ) : (
    <span className="cursor-not-allowed text-gray-500">${category.monthly_budget.toFixed(2)}</span>
  );
}
