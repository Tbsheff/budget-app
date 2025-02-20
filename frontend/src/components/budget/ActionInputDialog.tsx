
import React from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CategoryAction } from "@/types/budget";

interface ActionInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionInProgress: CategoryAction | null;
  inputLabel: string;
  inputHelp: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  budgetGroups?: Array<{ budget_group_id: string; group_name: string; }>;
}

export const ActionInputDialog: React.FC<ActionInputDialogProps> = ({
  open,
  onOpenChange,
  actionInProgress,
  inputLabel,
  inputHelp,
  inputValue,
  onInputChange,
  onSubmit,
  budgetGroups,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{inputLabel}</AlertDialogTitle>
          <AlertDialogDescription>{inputHelp}</AlertDialogDescription>
        </AlertDialogHeader>
        
        {actionInProgress === "MOVE" && budgetGroups ? (
          <Select onValueChange={onInputChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select new group" />
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
        ) : (
          <Input
            type={actionInProgress === "RENAME" ? "text" : "number"}
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={actionInProgress === "RENAME" ? "New name" : "Amount"}
            min={actionInProgress === "DECREASE" ? 0 : undefined}
            step={actionInProgress === "RENAME" ? undefined : "0.01"}
          />
        )}
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
