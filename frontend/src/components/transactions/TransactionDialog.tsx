import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TransactionDialog = ({
  open,
  onClose,
  extractedData,
  categories,
  onSave,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Transaction Details</DialogTitle>
        </DialogHeader>
        <Label>Amount</Label>
        <Input
          type="number"
          step="0.01"
          value={extractedData.amount}
          onChange={(e) => extractedData.setAmount(e.target.value)}
        />

        <Label>Description</Label>
        <Input
          value={extractedData.description}
          onChange={(e) => extractedData.setDescription(e.target.value)}
        />

        <Label>Category</Label>
        <Select
          value={extractedData.category}
          onValueChange={extractedData.setCategory}
        >
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

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Transaction</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;
