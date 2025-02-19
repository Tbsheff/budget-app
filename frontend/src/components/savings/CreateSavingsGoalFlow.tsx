import React from "react";
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
    name?: string;
    targetAmount?: number;
    deadline?: string;
    initialDeposit?: number;
  } | null;
  onInputSubmit: (input: string) => void;
}

export const CreateSavingsGoalFlow: React.FC<CreateSavingsGoalFlowProps> = ({
  currentFlow,
  onInputSubmit,
}) => {
  const [input, setInput] = React.useState("");
  const [date, setDate] = React.useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!currentFlow?.name) {
      // Validate goal name
      if (input.length < 3) {
        onInputSubmit("ERROR: Goal name must be at least 3 characters long");
        return;
      }
      onInputSubmit(input);
    } else if (!currentFlow?.targetAmount) {
      // Validate target amount
      const amount = parseFloat(input.replace(/[^0-9.]/g, ""));
      if (isNaN(amount) || amount <= 0) {
        onInputSubmit("ERROR: Please enter a valid positive amount");
        return;
      }
      onInputSubmit(input);
    } else if (!currentFlow?.deadline) {
      // Date is handled by the calendar component
      if (!date) {
        onInputSubmit("ERROR: Please select a valid date");
        return;
      }
      onInputSubmit(format(date, "MM/dd/yyyy"));
    } else if (!currentFlow?.initialDeposit) {
      // Validate initial deposit
      const deposit = parseFloat(input.replace(/[^0-9.]/g, ""));
      if (isNaN(deposit) || deposit < 0) {
        onInputSubmit("ERROR: Please enter a valid non-negative amount");
        return;
      }
      onInputSubmit(input);
    }

    setInput("");
  };

  const renderInput = () => {
    if (!currentFlow) return null;

    if (!currentFlow.name) {
      return (
        <Input
          placeholder="Enter goal name..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="mb-2"
        />
      );
    }

    if (!currentFlow.targetAmount) {
      return (
        <Input
          type="number"
          placeholder="Enter target amount..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="mb-2"
          min="0"
          step="0.01"
        />
      );
    }

    if (!currentFlow.deadline) {
      return (
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
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      );
    }

    if (!currentFlow.initialDeposit) {
      return (
        <Input
          type="number"
          placeholder="Enter initial deposit..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="mb-2"
          min="0"
          step="0.01"
        />
      );
    }

    return null;
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      {renderInput()}
      {currentFlow && !currentFlow.deadline && (
        <Button type="submit" className="w-full">
          Next
        </Button>
      )}
    </form>
  );
};
