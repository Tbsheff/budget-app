
import React from "react";
import { Button } from "@/components/ui/button";
import type { CategoryAction } from "@/types/budget";

interface CategoryActionsProps {
  selectedGroupName: string;
  selectedCategoryName: string;
  onActionSelect: (action: CategoryAction) => void;
}

export const CategoryActions: React.FC<CategoryActionsProps> = ({
  selectedGroupName,
  selectedCategoryName,
  onActionSelect,
}) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-purple-50 rounded-lg space-y-2">
        <p className="text-sm text-purple-700">Selected Group: <span className="font-medium">{selectedGroupName}</span></p>
        <p className="text-sm text-purple-700">Selected Category: <span className="font-medium">{selectedCategoryName}</span></p>
      </div>
      <div className="grid gap-3">
        <Button onClick={() => onActionSelect("INCREASE")} variant="outline">
          Increase Budget
        </Button>
        <Button onClick={() => onActionSelect("DECREASE")} variant="outline">
          Decrease Budget
        </Button>
        <Button onClick={() => onActionSelect("RENAME")} variant="outline">
          Rename Category
        </Button>
        <Button onClick={() => onActionSelect("MOVE")} variant="outline">
          Move to Different Group
        </Button>
      </div>
    </div>
  );
};
