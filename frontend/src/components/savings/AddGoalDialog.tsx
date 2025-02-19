import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PriorityLevel, SavingsCategory } from "@/types/savings";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { DetailedInfoStep } from "./steps/DetailedInfoStep";
import { useUser } from "../../context/userContext";

interface AddGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (goal: any) => void;
}

export function AddGoalDialog({
  open,
  onOpenChange,
  onSave,
}: AddGoalDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState<Date>();
  const [initialDeposit, setInitialDeposit] = useState("");
  const [priority, setPriority] = useState<PriorityLevel>("Medium");
  const [category, setCategory] = useState<SavingsCategory>("Other");
  const [notes, setNotes] = useState("");
  const User = useUser();

  useEffect(() => {
    if (open) {
      setStep(1);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !targetAmount || !targetDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newGoal = {
      user_id: User.user.id,
      name,
      target_amount: parseFloat(targetAmount),
      current_amount: parseFloat(initialDeposit || "0"),
      deadline: targetDate,
      //   priority,
      //   category,
      //   notes: notes.trim(),
      //   completed: false,
      //   createdAt: new Date(),
    };

    onSave(newGoal);

    // Reset form
    setName("");
    setTargetAmount("");
    setTargetDate(undefined);
    setInitialDeposit("");
    setPriority("Medium");
    setCategory("Other");
    setNotes("");
    setStep(1);

    onOpenChange(false);
  };

  const handleClose = () => {
    setStep(1);
    onOpenChange(false);
  };

  const canProceed = () => {
    console.log("Checking canProceed:", {
      name: name.trim(),
      targetAmount,
      targetDate,
    });
    if (step === 1) {
      return name.trim() && targetAmount && targetDate;
    }
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Savings Goal - Step {step} of 2</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            <BasicInfoStep
              name={name}
              setName={setName}
              targetAmount={targetAmount}
              setTargetAmount={setTargetAmount}
              targetDate={targetDate}
              setTargetDate={setTargetDate}
            />
          ) : (
            <DetailedInfoStep
              initialDeposit={initialDeposit}
              setInitialDeposit={setInitialDeposit}
              priority={priority}
              setPriority={setPriority}
              category={category}
              setCategory={setCategory}
              notes={notes}
              setNotes={setNotes}
            />
          )}

          <div className="flex justify-between space-x-2 pt-4">
            {step === 2 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            ) : (
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            )}

            {step === 1 ? (
              <Button
                type="button"
                onClick={() => setStep(2)}
                disabled={!canProceed()}
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit}>
                Add Goal
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
