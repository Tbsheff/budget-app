import { useState } from "react";
import { DollarSign, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const TransactionForm = ({ categories }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(
        "/api/expenses",
        {
          category_id: parseInt(categoryId),
          amount: parseFloat(amount),
          description,
          transaction_date: transactionDate,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast({
        title: "Transaction Added",
        description: "Your transaction has been successfully added.",
      });

      setAmount("");
      setDescription("");
      setCategoryId("");
      setTransactionDate("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add the transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Label>Amount</Label>
      <Input
        type="number"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <Label>Description</Label>
      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <Label>Category</Label>
      <Select value={categoryId} onValueChange={setCategoryId}>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.category_id} value={cat.category_id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label>Transaction Date</Label>
      <Input
        type="date"
        value={transactionDate}
        onChange={(e) => setTransactionDate(e.target.value)}
        required
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="animate-spin" />
        ) : (
          "Add Transaction"
        )}
      </Button>
    </form>
  );
};

export default TransactionForm;
