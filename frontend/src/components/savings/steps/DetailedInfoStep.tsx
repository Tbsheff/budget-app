import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PriorityLevel } from "@/types/savings";

interface DetailedInfoStepProps {
  initialDeposit: string;
  setInitialDeposit: (deposit: string) => void;
  priority: PriorityLevel;
  setPriority: (priority: PriorityLevel) => void;
  category: string;
  setCategory: (category: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
}

interface UserCategory {
  id: string;
  name: string;
}

export function DetailedInfoStep({
  initialDeposit,
  setInitialDeposit,
  priority,
  setPriority,
  category,
  setCategory,
  notes,
  setNotes,
}: DetailedInfoStepProps) {
  const [userCategories, setUserCategories] = useState<UserCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<UserCategory[]>(
          "/api/user-categories",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserCategories(response.data);
      } catch (error) {
        console.error("Error fetching user categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="initialDeposit">Initial Deposit</Label>
        <Input
          id="initialDeposit"
          type="number"
          min="0"
          step="0.01"
          value={initialDeposit}
          onChange={(e) => setInitialDeposit(e.target.value)}
          placeholder="0.00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priority Level</Label>
        <Select
          value={priority}
          onValueChange={(value: PriorityLevel) => setPriority(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={category}
          onValueChange={(value: string) => setCategory(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {userCategories.map((userCategory) => (
              <SelectItem key={userCategory.id} value={userCategory.id}>
                {userCategory.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional notes..."
          className="h-20"
        />
      </div>
    </>
  );
}
