export interface SavingsGoal {
  id: number;
  userId: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: Date;
  priority: string;
  category: string;
  notes?: string;
  completed: boolean;
}
