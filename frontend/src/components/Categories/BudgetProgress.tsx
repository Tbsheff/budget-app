import { Progress } from "../ui/progress";

interface BudgetProgressProps {
  actual: number;
  budgeted: number;
}

function BudgetProgress({ actual, budgeted }: BudgetProgressProps) {
  const calculateProgress = (actual: number, budgeted: number) => {
    if (budgeted === 0) return 100;
    return Math.max(0, 100 - (actual / budgeted) * 100);
  };

  return (
    <Progress
      value={calculateProgress(actual, budgeted)}
      className="h-1.5 w-full"
    />
  );
}

export default BudgetProgress;
