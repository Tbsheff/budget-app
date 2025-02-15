import { cn } from "@/lib/utils"; // Ensure utility for class merging
import { Progress } from "../ui/progress";

interface BudgetProgressProps {
  actual: number;
  budgeted: number;
}

function BudgetProgress({ actual, budgeted }: BudgetProgressProps) {
  const calculateRemaining = (actual: number, budgeted: number) => {
    if (budgeted === 0) return 0; // Avoid division by zero
    return Math.max(0, 100 - (actual / budgeted) * 100); // Reverse progress
  };

  const remainingPercentage = calculateRemaining(actual, budgeted);

  // Dynamic colors based on remaining budget
  const progressColor =
    remainingPercentage <= 25
      ? "bg-red-500/75"
      : remainingPercentage <= 50
        ? "bg-yellow-500/75"
        : "bg-green-500/80";

  return (
    <div className="relative w-full h-2 bg-gray-300 rounded-md overflow-hidden">
      <div
        className={cn("h-full transition-all duration-300", progressColor)}
        style={{ width: `${remainingPercentage}%` }} // Adjust width dynamically
      />
    </div>
  );
}

export default BudgetProgress;
