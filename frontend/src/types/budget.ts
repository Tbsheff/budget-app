import { LucideIcon } from "lucide-react";

export interface Category {
  name: string;
  budgeted: number;
  actual: number;
  icon: LucideIcon;
  color: string;
}
