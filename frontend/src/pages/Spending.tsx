import { useState, useEffect } from "react";
import axios from "axios";
import { Download } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Transaction } from "../types/transaction";
import { TransactionFilters } from "../components/transactions/TransactionFilters";
import { TransactionsTable } from "../components/transactions/TransactionsTable";

// Define API response types
interface Category {
  category_id: number;
  name: string;
}

interface ExpenseResponse {
  transaction_id: number;
  description: string;
  category_name: string;
  amount: number;
  transaction_date: string;
}

interface IncomeResponse {
  income_id: number;
  name: string;
  amount: number;
  pay_date: string;
}

const SpendingPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"month" | "year">("month");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValues, setEditingValues] = useState<{
    name: string;
    category: string;
    amount: number;
    date: Date;
  }>({
    name: "",
    category: "",
    amount: 0,
    date: new Date(),
  });

  const handleExport = () => {
    if (transactions.length === 0) {
      toast({ title: "No Data", description: "There are no transactions to export." });
      return;
    }

    const filteredTransactions = transactions.filter(
      (t) =>
        t.date.getFullYear() === selectedDate.getFullYear() &&
        (viewMode === "month" ? t.date.getMonth() === selectedDate.getMonth() : true) &&
        (selectedCategories.length === 0 || selectedCategories.includes(t.category)) &&
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredTransactions.length === 0) {
      toast({ title: "No Matching Data", description: "No transactions match your filters." });
      return;
    }

    const csvHeader = ["Date,Name,Category,Amount"];
    const csvRows = filteredTransactions.map(
      (t) => `${format(t.date, "yyyy-MM-dd")},${t.name},${t.category},${t.amount.toFixed(2)}`
    );

    const csvContent = [csvHeader, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Dynamically adjust filename based on the selected view mode
    const fileName =
      viewMode === "month"
        ? `transactions_${format(selectedDate, "yyyy-MM")}.csv` // e.g., transactions_2025-02.csv
        : `transactions_${selectedDate.getFullYear()}.csv`; // e.g., transactions_2025.csv

    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Fetch user categories dynamically
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<Category[]>("/api/user-categories", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Sort categories alphabetically before setting state
        const sortedCategories = response.data
          .map((cat) => cat.name)
          .sort((a, b) => a.localeCompare(b));

        setCategories(sortedCategories);

        // Only update selectedCategories if it's empty (to avoid overwriting user selection)
        setSelectedCategories((prev) => (prev.length === 0 ? sortedCategories : prev));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch transactions dynamically from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const startDate = format(
          new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
          "yyyy-MM-dd"
        );
        const endDate = format(
          new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0),
          "yyyy-MM-dd"
        );

        // Fetch expenses
        const expensesRes = await axios.get<ExpenseResponse[]>("/api/expenses", {
          headers: { Authorization: `Bearer ${token}` },
          params: { startDate, endDate },
        });

        // Fetch incomes
        const incomesRes = await axios.get<IncomeResponse[]>("/api/incomes", {
          headers: { Authorization: `Bearer ${token}` },
          params: { startDate, endDate },
        });

        // Map expense transactions
        const expenseTransactions: Transaction[] = expensesRes.data.map((t) => ({
          id: t.transaction_id,
          name: t.description,
          category: t.category_name, // ✅ Now using category_name
          amount: Number(t.amount), // Ensure it's a number
          date: parseISO(t.transaction_date),
          type: "expense",
        }));

        // Map income transactions
        const incomeTransactions: Transaction[] = incomesRes.data.map((t) => ({
          id: t.income_id,
          name: t.name,
          category: "Earnings", // Force incomes to show under Earnings
          amount: Number(t.amount),
          date: parseISO(t.pay_date),
          type: "income",
        }));

        // Combine transactions
        setTransactions([...expenseTransactions, ...incomeTransactions]);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [selectedDate]);

  // Handle edit start
  const handleStartEditing = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditingValues({
      name: transaction.name,
      category: transaction.category,
      amount: transaction.amount,
      date: transaction.date ? new Date(transaction.date) : new Date(),
    });
  };

  // Handle edit cancel
  const handleCancelEditing = () => {
    setEditingId(null);
    setEditingValues({ name: "", category: "", amount: 0, date: new Date() });
  };

  // Handle edit save
  const handleSaveEditing = async (id: number) => {
    const updatedTransaction = transactions.find((t) => t.id === id);
    if (!updatedTransaction) return;

    // Check if any values have actually changed before saving
    if (
      updatedTransaction.name === editingValues.name &&
      updatedTransaction.category === editingValues.category &&
      updatedTransaction.amount === editingValues.amount &&
      format(updatedTransaction.date, "yyyy-MM-dd") === format(editingValues.date, "yyyy-MM-dd")
    ) {
      setEditingId(null);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/${updatedTransaction.type === "income" ? "incomes" : "expenses"}/${id}`,
        {
          description: editingValues.name, // ✅ Ensure `description` is used instead of `name`
          category_id: categories.findIndex((cat) => cat === editingValues.category) + 1, // ✅ Convert category name to category_id
          amount: editingValues.amount,
          transaction_date: format(editingValues.date, "yyyy-MM-dd"),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...editingValues } : t)));
      setEditingId(null);
      toast({ title: "Transaction Updated", description: "Changes saved successfully!" });
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast({ title: "Error", description: "Failed to update transaction." });
    }
  };

  // Handle delete with confirmation
  const handleDeleteTransaction = async (id: number) => {
    setShowDeleteConfirmation(id); // Show confirmation dialog for the selected transaction
  };

  const confirmDeleteTransaction = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTransactions((prev) => prev.filter((t) => t.id !== id));
      toast({ title: "Transaction Deleted", description: "Transaction has been removed." });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast({ title: "Error", description: "Failed to delete transaction." });
    } finally {
      setShowDeleteConfirmation(null); // Hide confirmation dialog
    }
  };

  // State to track the transaction being deleted
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<number | null>(null);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleExport}>
              <Download className="w-4 h-4" /> Export
            </Button>
          </div>

          {/* Transaction Filters */}
          <TransactionFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            categories={categories}
          />

          <div className="bg-white rounded-lg shadow">
            <TransactionsTable
              transactions={transactions.filter(
                (t) =>
                  t.date.getFullYear() === selectedDate.getFullYear() &&
                  (viewMode === "month" ? t.date.getMonth() === selectedDate.getMonth() : true) &&
                  (selectedCategories.length === 0 || selectedCategories.includes(t.category)) &&
                  t.name.toLowerCase().includes(searchQuery.toLowerCase())
              )}
              categories={categories}
              editingId={editingId}
              editingValues={editingValues}
              onStartEditing={handleStartEditing}
              onCancelEditing={handleCancelEditing}
              onSaveEditing={handleSaveEditing}
              onDeleteTransaction={handleDeleteTransaction}
              onEditingValuesChange={setEditingValues}
            />
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={showDeleteConfirmation !== null}
        onOpenChange={() => setShowDeleteConfirmation(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>Are you sure?</AlertDialogHeader>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirmation(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmDeleteTransaction(showDeleteConfirmation!)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SpendingPage;
