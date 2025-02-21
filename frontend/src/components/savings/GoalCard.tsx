import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SavingsGoal } from "@/types/savings";
import { differenceInDays, format } from "date-fns";
import { Check, Pencil } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { EditGoalDialog } from "./EditGoalDialog";

interface GoalCardProps {
  goal: SavingsGoal;
  onEdit: (goal: SavingsGoal) => void;
  onComplete: (goal: SavingsGoal) => void;
}

export function GoalCard({ goal, onEdit, onComplete }: GoalCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const progress = (goal.current_amount / goal.target_amount) * 100;
  const daysRemaining = differenceInDays(new Date(goal.deadline), new Date());
  const monthsRemaining = Math.ceil(daysRemaining / 30);
  const monthlyNeeded =
    monthsRemaining > 0
      ? (goal.target_amount - goal.current_amount) / monthsRemaining
      : 0;

  const isOnTrack =
    progress >= ((monthsRemaining > 0 ? 12 - monthsRemaining : 12) / 12) * 100;

  const handleSave = async (editedGoal: SavingsGoal) => {
    try {
      const response = await axios.put(
        `/api/savings-goals/${goal.id}`,
        editedGoal,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      onEdit(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{goal.name}</h3>
          <p className="text-sm text-gray-500">{goal.category}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
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
          <span className="flex items-center">
            ${parseFloat(goal.current_amount.toString()).toFixed(2)}
          </span>
          <span className="flex items-center">
            ${parseFloat(goal.target_amount.toString()).toFixed(2)}
          </span>
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
        <div>
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
        </div>
      </div>

      {goal.notes && (
        <div className="text-sm">
          <p className="text-gray-500">Notes</p>
          <p>{goal.notes}</p>
        </div>
      )}

      <EditGoalDialog
        goal={goal}
        open={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
      />
    </div>
  );
}
