import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

interface BasicInfoStepProps {
  name: string;
  setName: (name: string) => void;
  targetAmount: string;
  setTargetAmount: (amount: string) => void;
  targetDate: Date | undefined;
  setTargetDate: (date: Date | undefined) => void;
}

export function BasicInfoStep({
  name,
  setName,
  targetAmount,
  setTargetAmount,
  targetDate,
  setTargetDate,
}: BasicInfoStepProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Goal Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter goal name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetAmount">Target Amount *</Label>
        <Input
          id="targetAmount"
          type="number"
          min="0"
          step="0.01"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          placeholder="0.00"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Target Date *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {targetDate ? format(targetDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={targetDate}
              onSelect={setTargetDate}
              fromDate={new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
