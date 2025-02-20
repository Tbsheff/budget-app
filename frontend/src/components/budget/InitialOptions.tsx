
import React from "react";
import { Button } from "@/components/ui/button";
import type { BudgetAction } from "@/types/budget";

interface InitialOptionsProps {
  onActionSelect: (action: BudgetAction) => void;
}

export const InitialOptions: React.FC<InitialOptionsProps> = ({ onActionSelect }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">What would you like to change?</h3>
      <div className="grid gap-3">
        <Button onClick={() => onActionSelect("EDIT_CATEGORY")} variant="outline">
          Edit a budget category
        </Button>
        <Button onClick={() => onActionSelect("EDIT_GROUP")} variant="outline">
          Edit a budget group
        </Button>
        <Button onClick={() => onActionSelect("ADD_CATEGORY")} variant="outline">
          Add a new category
        </Button>
        <Button onClick={() => onActionSelect("ADD_GROUP")} variant="outline">
          Add a new budget group
        </Button>
        <Button onClick={() => onActionSelect("REMOVE_CATEGORY")} variant="outline">
          Remove a category
        </Button>
        <Button onClick={() => onActionSelect("REMOVE_GROUP")} variant="outline">
          Remove a budget group
        </Button>
        <Button onClick={() => onActionSelect("OTHER")} variant="outline">
          Something else
        </Button>
      </div>
    </div>
  );
};
