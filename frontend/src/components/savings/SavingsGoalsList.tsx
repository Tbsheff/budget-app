import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { GoalCard } from "./GoalCard";
import { SavingsGoal } from "@/types/savings";
import axios from "axios";
import { useUser } from "@/context/userContext";

interface SavingsGoalsListProps {
  onSelectGoal: (goal: SavingsGoal) => void;
}

export function SavingsGoalsList({ onSelectGoal }: SavingsGoalsListProps) {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/savings-goals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGoals(response.data);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    if (user) {
      fetchGoals();
    }
  }, [user]);

  const handleEdit = async (updatedGoal: SavingsGoal) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/savings-goals/${updatedGoal.id}`, updatedGoal, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Fetch the updated goals list instead of just replacing one item
      const response = await axios.get("/api/savings-goals", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setGoals(response.data); // Ensure UI updates with latest data
    } catch (error) {
      console.error("Error updating savings goal:", error);
    }
  };
  

  const handleComplete = async (goal: SavingsGoal) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/savings-goals/${goal.id}/complete`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(
        goals.map((g) => (g.id === goal.id ? { ...g, completed: true } : g))
      );
    } catch (error) {
      console.error("Error completing goal:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {goals.map((goal) => (
        <div
          key={goal.id}
          onClick={() => onSelectGoal(goal)}
          className="cursor-pointer"
        >
          <GoalCard
            goal={goal}
            onEdit={handleEdit}
            onComplete={handleComplete}
          />
        </div>
      ))}
    </div>
  );
}
