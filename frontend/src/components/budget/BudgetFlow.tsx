import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/lib/budget";
import type {
  Budget,
  BudgetAction,
  CategoryAction,
  GroupAction,
  BudgetChange,
} from "@/types/budget";
import axios from "axios";

interface BudgetFlowProps {
  budget: Budget;
  onBudgetChange: (changes: BudgetChange[]) => Promise<void>;
  onComplete: () => void;
}

export const BudgetFlow: React.FC<BudgetFlowProps> = ({
  budget,
  onBudgetChange,
  onComplete,
}) => {
  const [selectedAction, setSelectedAction] = useState<BudgetAction | null>(
    null
  );
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [subAction, setSubAction] = useState<
    CategoryAction | GroupAction | null
  >(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [pendingChanges, setPendingChanges] = useState<BudgetChange[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [budgetGroups, setBudgetGroups] = useState<any[]>([]);

  useEffect(() => {
    const fetchBudgetGroups = async () => {
      try {
        const response = await axios.get("/api/budget-groups", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setBudgetGroups(response.data);
      } catch (error) {
        console.error("Error fetching budget groups:", error);
      }
    };

    fetchBudgetGroups();
  }, []);

  const handleMainAction = (action: BudgetAction) => {
    setSelectedAction(action);
    resetSubStates();
  };

  const resetSubStates = () => {
    setSelectedGroupId(null);
    setSelectedCategoryId(null);
    setSubAction(null);
    setInputValue("");
  };

  const addChange = (change: BudgetChange) => {
    setPendingChanges([...pendingChanges, change]);
  };

  const handleConfirm = async () => {
    try {
      await onBudgetChange(pendingChanges);
      setShowConfirmation(false);
      setPendingChanges([]);
      onComplete();
    } catch (error) {
      console.error("Error applying budget changes:", error);
    }
  };

  const renderInitialOptions = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">What would you like to change?</h3>
      <div className="grid gap-3">
        <Button
          onClick={() => handleMainAction("EDIT_CATEGORY")}
          variant="outline"
        >
          Edit a budget category
        </Button>
        <Button
          onClick={() => handleMainAction("EDIT_GROUP")}
          variant="outline"
        >
          Edit a budget group
        </Button>
        <Button
          onClick={() => handleMainAction("ADD_CATEGORY")}
          variant="outline"
        >
          Add a new category
        </Button>
        <Button onClick={() => handleMainAction("ADD_GROUP")} variant="outline">
          Add a new budget group
        </Button>
        <Button
          onClick={() => handleMainAction("REMOVE_CATEGORY")}
          variant="outline"
        >
          Remove a category
        </Button>
        <Button
          onClick={() => handleMainAction("REMOVE_GROUP")}
          variant="outline"
        >
          Remove a budget group
        </Button>
        <Button onClick={() => handleMainAction("OTHER")} variant="outline">
          Something else
        </Button>
      </div>
    </div>
  );

  const renderGroupSelect = () => (
    <div className="space-y-4">
      <Label>Select a budget group</Label>
      <Select onValueChange={(value) => setSelectedGroupId(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Choose a group" />
        </SelectTrigger>
        <SelectContent>
          {budgetGroups.map((group) => (
            <SelectItem
              key={group.budget_group_id}
              value={group.budget_group_id}
            >
              {group.group_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const renderCategorySelect = () => (
    <div className="space-y-4">
      <Label>Select a category</Label>
      <Select onValueChange={(value) => setSelectedCategoryId(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Choose a category" />
        </SelectTrigger>
        <SelectContent>
          {budgetGroups.map((group) => (
            <React.Fragment key={group.budget_group_id}>
              {group.categories.map((category) => (
                <SelectItem
                  key={category.category_id}
                  value={category.category_id}
                >
                  {category.name} ({formatCurrency(category.monthly_budget)})
                </SelectItem>
              ))}
            </React.Fragment>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const renderConfirmationDialog = () => (
    <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Budget Changes</AlertDialogTitle>
          <AlertDialogDescription>
            Here's a summary of your changes:
            {pendingChanges.map((change, index) => (
              <div key={index} className="mt-2">
                • {change.type === "CATEGORY" ? "Category" : "Group"}{" "}
                {change.target}: {change.action} → {change.detail}
              </div>
            ))}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Apply Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <div className="space-y-6">
      {!selectedAction && renderInitialOptions()}
      {selectedAction && !selectedGroupId && renderGroupSelect()}
      {selectedAction === "EDIT_CATEGORY" &&
        selectedGroupId &&
        !selectedCategoryId &&
        renderCategorySelect()}
      {renderConfirmationDialog()}
    </div>
  );
};
