import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SavingsGoal } from "@/types/savings";
import { format } from "date-fns";
import { Save, X } from "lucide-react";

interface EditGoalDialogProps {
  goal: SavingsGoal;
  open: boolean;
  onClose: () => void;
  onSave: (goal: SavingsGoal) => void;
}

export function EditGoalDialog({
  goal,
  open,
  onClose,
  onSave,
}: EditGoalDialogProps) {
  const [editedGoal, setEditedGoal] = useState(goal);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedGoal({ ...editedGoal, [name]: value });
  };
  const handleSave = async () => {
    try {
      const response = await fetch(`/api/savings-goals/${editedGoal.goal_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editedGoal),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update goal");
      }
  
      const updatedGoal = await response.json();
      onSave(updatedGoal); 
      onClose();
  
      // ✅ Force a full page refresh after saving
      setTimeout(() => {
        window.location.reload();
      }, 500); // Delay to ensure UI updates smoothly
    } catch (error) {
      console.error("Error updating savings goal:", error);
    }
  };
  
  
  

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Savings Goal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={editedGoal.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Amount
            </label>
            <div className="flex items-center border border-gray-300 rounded p-2">
              $
              <input
                type="number"
                name="current_amount"
                value={editedGoal.current_amount}
                onChange={handleInputChange}
                className="w-full border-none outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Target Amount
            </label>
            <div className="flex items-center border border-gray-300 rounded p-2">
              $
              <input
                type="number"
                name="target_amount"
                value={editedGoal.target_amount}
                onChange={handleInputChange}
                className="w-full border-none outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={format(new Date(editedGoal.deadline), "yyyy-MM-dd")}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <input
              type="text"
              name="priority"
              value={editedGoal.priority}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
