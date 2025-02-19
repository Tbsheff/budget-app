import { LucideIcon } from "lucide-react";

export interface Category {
  name: string;
  budgeted: number;
  actual: number;
  icon: LucideIcon;
  color: string;
}

export interface BudgetGroup {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  categories: Category[];
}

export interface Budget {
  totalIncome: number;
  groups: BudgetGroup[];
}

export type BudgetAction =
  | "EDIT_CATEGORY"
  | "EDIT_GROUP"
  | "ADD_CATEGORY"
  | "ADD_GROUP"
  | "REMOVE_CATEGORY"
  | "REMOVE_GROUP"
  | "OTHER";

export type CategoryAction = "INCREASE" | "DECREASE" | "MOVE" | "RENAME";

export type GroupAction =
  | "INCREASE"
  | "DECREASE"
  | "RENAME"
  | "MOVE_CATEGORIES";

export interface BudgetChange {
  type: "CATEGORY" | "GROUP";
  action: string;
  target: string;
  detail: string;
  newValue: string | number;
}
