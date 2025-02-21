import axios from "axios";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddGoalDialog } from "@/components/savings/AddGoalDialog";
import { GoalCard } from "@/components/savings/GoalCard";
import { SavingsSummary } from "@/components/savings/SavingsSummary";
import { SavingsGoal } from "@/types/savings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MobileMenu } from "@/components/mobilemenu";

export default function SavingsPlan() {
  const { toast } = useToast();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("targetDate");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get("/api/savings-goals", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Goals:", response.data);
        setGoals(response.data);
      } catch (error) {
        console.error("Error fetching savings goals:", error);
        toast({
          title: "Error",
          description: "Failed to fetch savings goals. Please try again.",
        });
      }
    };

    fetchGoals();
  }, [toast]);

  const handleSaveGoal = async (goal: SavingsGoal) => {
    try {
      console.log("Goal:", goal);
      const response = await axios.post("/api/savings-goals/create", goal, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setGoals((prev) => [...prev, response.data]);
      toast({
        title: "Goal Created",
        description: "Your new savings goal has been created successfully.",
      });
    } catch (error) {
      console.error("Error creating savings goal:", error);
      toast({
        title: "Error",
        description: "Failed to create savings goal. Please try again.",
      });
    }
  };

  const handleEditGoal = (goal: SavingsGoal) => {
    // To be implemented: edit functionality
    toast({
      title: "Coming Soon",
      description: "Edit functionality will be available soon.",
    });
  };

  const handleCompleteGoal = (goal: SavingsGoal) => {
    setGoals((prev) =>
      prev.map((g) => (g.goal_id === goal.goal_id ? { ...g, completed: true } : g))
    );
    toast({
      title: "Goal Completed",
      description: "Congratulations on reaching your savings goal!",
    });
  };

  const sortedAndFilteredGoals = goals
    .filter(
      (goal) => filterCategory === "all" || goal.category === filterCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "targetDate":
          return (
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );
        case "priority": {
          const priorityOrder = { High: 0, Medium: 1, Low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case "progress": {
          const progressA = (a.current_amount / a.target_amount) * 100;
          const progressB = (b.current_amount / b.target_amount) * 100;
          return progressB - progressA;
        }
        default:
          return 0;
      }
    });

    return (
      <div className="flex h-screen bg-gray-100">
        {/* Mobile Menu */}
        <MobileMenu />
    
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
    
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 mt-16 md:mt-0">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold">Savings Plan</h1>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Goal
            </Button>
          </div>
    
          <SavingsSummary goals={goals} />
    
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="w-full md:w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="targetDate">Target Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
    
            <div className="w-full md:w-48">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Emergency Fund">Emergency Fund</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                  <SelectItem value="Major Purchase">Major Purchase</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Vehicle">Vehicle</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
    
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedAndFilteredGoals.map((goal) => (
              <GoalCard
                key={goal.goal_id}
                goal={goal}
                onEdit={handleEditGoal}
                onComplete={handleCompleteGoal}
              />
            ))}
          </div>
    
          <AddGoalDialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onSave={handleSaveGoal}
          />
        </main>
      </div>
    );
    
}
