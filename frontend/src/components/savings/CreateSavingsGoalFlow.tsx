import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CreateSavingsGoalFlowProps {
  currentFlow: {
    type: string;
    name?: string | null;
    targetAmount?: number | null;
    deadline?: string | null;
    initialDeposit?: number | null;
  } | null;
  onInputSubmit: (input: string) => void;
}

export const CreateSavingsGoalFlow: React.FC<CreateSavingsGoalFlowProps> = ({
  currentFlow,
  onInputSubmit,
}) => {
  const [input, setInput] = useState("");
  const [date, setDate] = useState<Date | null>(null);

  // Update component state when `currentFlow` changes
  useEffect(() => {
    setInput(""); // Clear input when switching steps
    if (currentFlow?.deadline) {
      setDate(new Date(currentFlow.deadline)); // Update selected date if already set
    }
  }, [currentFlow]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !date) return;

    if (!currentFlow?.name) {
      if (input.length < 3) {
        onInputSubmit("ERROR: Goal name must be at least 3 characters long");
        return;
      }
      onInputSubmit(input);
    } else if (!currentFlow?.targetAmount) {
      const amount = parseFloat(input.replace(/[^0-9.]/g, ""));
      if (isNaN(amount) || amount <= 0) {
        onInputSubmit("ERROR: Please enter a valid positive amount");
        return;
      }
      onInputSubmit(input);
    } else if (!currentFlow?.deadline) {
      if (!date) {
        onInputSubmit("ERROR: Please select a valid date");
        return;
      }
      onInputSubmit(format(date, "yyyy-MM-dd"));
    } else if (!currentFlow?.initialDeposit) {
      const deposit = parseFloat(input.replace(/[^0-9.]/g, ""));
      if (isNaN(deposit) || deposit < 0) {
        onInputSubmit("ERROR: Please enter a valid non-negative amount");
        return;
      }
      onInputSubmit(input);
    }

    setInput(""); // Reset input field
  };

  const renderInput = () => {
    if (!currentFlow) return null;

    if (!currentFlow.name) {
      return (
        <>
          <label className="block text-sm font-medium text-gray-700">
            Goal Name
          </label>
          <Input
            placeholder="Enter goal name..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mb-2"
          />
        </>
      );
    }

    if (!currentFlow.targetAmount) {
      return (
        <>
          <label className="block text-sm font-medium text-gray-700">
            Target Amount ($)
          </label>
          <Input
            type="number"
            placeholder="Enter target amount..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mb-2"
            min="0"
            step="0.01"
          />
        </>
      );
    }

    if (!currentFlow.deadline) {
      return (
        <>
          <label className="block text-sm font-medium text-gray-700">
            Target Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal mb-2",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date || undefined}
                onSelect={setDate}
                initialFocus
                disabled={(d) => d < new Date()} // Disable past dates
              />
            </PopoverContent>
          </Popover>
        </>
      );
    }

    if (!currentFlow.initialDeposit) {
      return (
        <>
          <label className="block text-sm font-medium text-gray-700">
            Initial Deposit ($)
          </label>
          <Input
            type="number"
            placeholder="Enter initial deposit..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mb-2"
            min="0"
            step="0.01"
          />
        </>
      );
    }

    return null;
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      {renderInput()}
      <Button type="submit" className="w-full mt-3">
        Next
      </Button>
    </form>
  );
};
