import { format } from "date-fns";
import { DollarSign, Pencil, Trash, Check, X } from "lucide-react";
import { Transaction } from "../../types/transaction";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditingValues {
  name: string;
  category: string;
  amount: number;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  categories: string[];
  editingId: number | null;
  editingValues: EditingValues;
  onStartEditing: (transaction: Transaction) => void;
  onCancelEditing: () => void;
  onSaveEditing: (id: number) => void;
  onDeleteTransaction: (id: number) => void;
  onEditingValuesChange: (values: EditingValues) => void;
}

export function TransactionsTable({
  transactions,
  categories,
  editingId,
  editingValues,
  onStartEditing,
  onCancelEditing,
  onSaveEditing,
  onDeleteTransaction,
  onEditingValuesChange,
}: TransactionsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id} className="hover:bg-gray-50">
            <TableCell className="font-medium">
              {format(transaction.date, "MMM dd, yyyy")}
            </TableCell>
            <TableCell>
              {editingId === transaction.id ? (
                <Input
                  value={editingValues.name}
                  onChange={(e) =>
                    onEditingValuesChange({
                      ...editingValues,
                      name: e.target.value,
                    })
                  }
                  className="w-full"
                />
              ) : (
                transaction.name
              )}
            </TableCell>
            <TableCell>
              {editingId === transaction.id ? (
                <Select
                  value={editingValues.category.toLowerCase()}
                  onValueChange={(value) =>
                    onEditingValuesChange({
                      ...editingValues,
                      category: value.charAt(0).toUpperCase() + value.slice(1),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                transaction.category
              )}
            </TableCell>
            <TableCell className="text-right">
              {editingId === transaction.id ? (
                <Input
                  type="number"
                  value={editingValues.amount}
                  onChange={(e) =>
                    onEditingValuesChange({
                      ...editingValues,
                      amount: parseFloat(e.target.value),
                    })
                  }
                  className="w-full text-right"
                  step="0.01"
                />
              ) : (
                <div
                  className={`flex items-center justify-end gap-1 ${
                    transaction.type === "expense"
                      ? "text-[#ea384c]"
                      : "text-green-500"
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  {transaction.amount.toFixed(2)}
                </div>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                {editingId === transaction.id ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onSaveEditing(transaction.id)}
                      className="h-8 w-8"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onCancelEditing}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onStartEditing(transaction)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteTransaction(transaction.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
