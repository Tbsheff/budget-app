/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatCurrency } from "@/lib/budget";
import type {
  Budget,
  BudgetAction,
  CategoryAction,
  BudgetChange,
} from "@/types/budget";
import { InitialOptions } from "./InitialOptions";
import { GroupSelect } from "./GroupSelect";
import { CategorySelect } from "./CategorySelect";
import { CategoryActions } from "./CategoryActions";
import { ActionInputDialog } from "./ActionInputDialog";
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
import { Button } from "@/components/ui/button";

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
  const [selectedGroupName, setSelectedGroupName] = useState<string>("");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const [actionInProgress, setActionInProgress] =
    useState<CategoryAction | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [showInputDialog, setShowInputDialog] = useState(false);
  const [inputLabel, setInputLabel] = useState("");
  const [inputHelp, setInputHelp] = useState("");
  const [pendingChanges, setPendingChanges] = useState<BudgetChange[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [budgetGroups, setBudgetGroups] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

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

    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/user-categories", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchBudgetGroups();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      const category = categories.find(
        (c) => c.category_id === selectedCategoryId
      );
      setSelectedCategory(category);
    }
  }, [selectedCategoryId, categories]);

  const handleGroupSelect = (groupId: string, groupName: string) => {
    setSelectedGroupId(groupId);
    setSelectedGroupName(groupName);
  };

  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedCategoryName(categoryName);
  };

  const handleSubAction = (action: CategoryAction) => {
    setActionInProgress(action);
    switch (action) {
      case "INCREASE":
        setInputLabel("Increase Amount");
        setInputHelp(
          `Current budget: ${formatCurrency(selectedCategory?.monthly_budget || 0)}`
        );
        break;
      case "DECREASE":
        setInputLabel("Decrease Amount");
        setInputHelp(
          `Current budget: ${formatCurrency(selectedCategory?.monthly_budget || 0)}`
        );
        break;
      case "RENAME":
        setInputLabel("New Category Name");
        setInputHelp(`Current name: ${selectedCategory?.name}`);
        break;
      case "MOVE":
        setInputLabel("Select New Group");
        setInputHelp("Choose a new group for this category");
        break;
    }
    setShowInputDialog(true);
  };

  const handleInputSubmit = () => {
    if (!selectedCategory || !actionInProgress) return;

    const change: BudgetChange = {
      type: "CATEGORY",
      target: selectedCategory.category_id,
      action: actionInProgress,
      detail: inputValue,
      newValue: inputValue,
    };

    switch (actionInProgress) {
      case "INCREASE":
      case "DECREASE": {
        const amount = parseFloat(inputValue);
        if (isNaN(amount)) return;

        const newBudget =
          actionInProgress === "INCREASE"
            ? selectedCategory.monthly_budget + amount
            : selectedCategory.monthly_budget - amount;

        change.newValue = newBudget;
        change.detail = `${actionInProgress === "INCREASE" ? "Increased" : "Decreased"} by ${formatCurrency(amount)}`;
        break;
      }

      case "RENAME":
        change.detail = `Renamed from "${selectedCategory.name}" to "${inputValue}"`;
        break;

      case "MOVE": {
        const newGroup = budgetGroups.find(
          (g) => g.budget_group_id === inputValue
        );
        if (!newGroup) return;
        change.detail = `Moved to ${newGroup.group_name}`;
        break;
      }
    }

    setPendingChanges([...pendingChanges, change]);
    setShowInputDialog(false);
    setInputValue("");
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    try {
      await onBudgetChange(pendingChanges);
      setShowConfirmation(false);
      setPendingChanges([]);
      setShowCompletionDialog(true);
    } catch (error) {
      console.error("Error applying budget changes:", error);
    }
  };

  const handleReset = () => {
    setSelectedAction(null);
    setSelectedGroupId(null);
    setSelectedCategoryId(null);
    setSelectedGroupName("");
    setSelectedCategoryName("");
    setActionInProgress(null);
    setInputValue("");
    setShowCompletionDialog(false);
  };

  const handleClose = () => {
    setShowCompletionDialog(false);
    onComplete();
  };

  return (
    <div className="space-y-6">
      {!selectedAction && <InitialOptions onActionSelect={setSelectedAction} />}

      {selectedAction && !selectedGroupId && (
        <GroupSelect
          groups={budgetGroups}
          selectedGroupId={selectedGroupId}
          selectedGroupName={selectedGroupName}
          onGroupSelect={handleGroupSelect}
        />
      )}

      {selectedAction === "EDIT_CATEGORY" &&
        selectedGroupId &&
        !selectedCategoryId && (
          <CategorySelect
            categories={categories}
            selectedGroupId={selectedGroupId}
            selectedCategoryId={selectedCategoryId}
            selectedCategoryName={selectedCategoryName}
            onCategorySelect={handleCategorySelect}
          />
        )}

      {selectedAction === "EDIT_CATEGORY" &&
        selectedGroupId &&
        selectedCategoryId && (
          <CategoryActions
            selectedGroupName={selectedGroupName}
            selectedCategoryName={selectedCategoryName}
            onActionSelect={handleSubAction}
          />
        )}

      <ActionInputDialog
        open={showInputDialog}
        onOpenChange={setShowInputDialog}
        actionInProgress={actionInProgress}
        inputLabel={inputLabel}
        inputHelp={inputHelp}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSubmit={handleInputSubmit}
        budgetGroups={budgetGroups}
      />

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

      {/* <AlertDialog
        open={showCompletionDialog}
        onOpenChange={setShowCompletionDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Task Completed!</AlertDialogTitle>
            <AlertDialogDescription>
              Your budget changes have been saved. What would you like to do
              next?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-3">
            <Button variant="default" className="w-full" onClick={handleReset}>
              Make More Changes
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog> */}
    </div>
  );
};
