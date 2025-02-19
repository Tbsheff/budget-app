import { SavingsGoal } from "@/types/savings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Goal, PiggyBank, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { differenceInDays, format } from "date-fns";
import { Check, Pencil } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SavingsSummaryProps {
  goals: SavingsGoal[];
}

interface GoalCardProps {
  goal: SavingsGoal;
  onEdit: (goal: SavingsGoal) => void;
  onComplete: (goal: SavingsGoal) => void;
}

export function SavingsSummary({ goals }: SavingsSummaryProps) {
  const activeGoals = goals.filter((g) => !g.completed);
  const totalSavings = goals.reduce(
    (sum, goal) => sum + parseFloat(goal.current_amount.toString()),
    0
  );
  const totalMonthlyNeeded = activeGoals.reduce((sum, goal) => {
    const deadline = new Date(goal.deadline); // Ensure deadline is a Date object
    const daysRemaining = Math.max(
      0,
      Math.floor((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    );
    const monthsRemaining = Math.ceil(daysRemaining / 30);
    return (
      sum +
      (parseFloat(goal.target_amount.toString()) -
        parseFloat(goal.current_amount.toString())) /
        monthsRemaining
    );
  }, 0);

  const nextTargetDate =
    activeGoals.length > 0
      ? activeGoals.reduce(
          (earliest, goal) => {
            const deadline = new Date(goal.deadline); // Ensure deadline is a Date object
            return deadline < earliest ? deadline : earliest;
          },
          new Date(activeGoals[0].deadline) // Ensure deadline is a Date object
        )
      : null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalSavings.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
          <Goal className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeGoals.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Needed</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalMonthlyNeeded.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Next Target</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {nextTargetDate
              ? nextTargetDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "N/A"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function GoalCard({ goal, onEdit, onComplete }: GoalCardProps) {
  const progress = (goal.current_amount / goal.target_amount) * 100;
  const daysRemaining = differenceInDays(new Date(goal.deadline), new Date());
  const monthsRemaining = Math.ceil(daysRemaining / 30);
  const monthlyNeeded =
    monthsRemaining > 0
      ? (goal.target_amount - goal.current_amount) / monthsRemaining
      : 0;

  const isOnTrack =
    progress >= ((monthsRemaining > 0 ? 12 - monthsRemaining : 12) / 12) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{goal.name}</h3>
          <p className="text-sm text-gray-500">{goal.category}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(goal)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onComplete(goal)}
            disabled={goal.completed}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>${goal.current_amount?.toFixed(2) ?? "0.00"}</span>
          <span>${goal.target_amount?.toFixed(2) ?? "0.00"}</span>
        </div>
        <Progress value={progress} />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Target Date</p>
          <p className="font-medium">
            {goal.deadline
              ? format(new Date(goal.deadline), "MMM d, yyyy")
              : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Monthly Needed</p>
          <p className="font-medium">${monthlyNeeded.toFixed(2)}</p>
        </div>
        {/* <div>
          <p className="text-gray-500">Priority</p>
          <p className="font-medium">{goal.priority}</p>
        </div>
        <div>
          <p className="text-gray-500">Status</p>
          <p
            className={`font-medium ${isOnTrack ? "text-green-500" : "text-orange-500"}`}
          >
            {isOnTrack ? "On Track" : "Behind Schedule"}
          </p>
        </div> */}
      </div>

      {/* {goal.notes && (
        <div className="text-sm">
          <p className="text-gray-500">Notes</p>
          <p>{goal.notes}</p>
        </div>
      )} */}
    </div>
  );
}
