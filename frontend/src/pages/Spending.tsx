import { useState } from "react";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Transaction } from "../types/transaction";
import { TransactionFilters } from "../components/transactions/TransactionFilters";
import { TransactionsTable } from "../components/transactions/TransactionsTable";

const initialTransactions: Transaction[] = [
  {
    id: 1,
    date: new Date(2024, 1, 15),
    name: "Grocery Store",
    category: "Shopping",
    amount: 156.78,
    type: "expense",
  },
  {
    id: 2,
    date: new Date(2024, 1, 14),
    name: "Electric Bill",
    category: "Utilities",
    amount: 89.99,
    type: "expense",
  },
  {
    id: 3,
    date: new Date(2024, 1, 13),
    name: "Salary",
    category: "Income",
    amount: 3500.0,
    type: "income",
  },
  {
    id: 4,
    date: new Date(2024, 1, 12),
    name: "Gas Station",
    category: "Transportation",
    amount: 52.3,
    type: "expense",
  },
  {
    id: 5,
    date: new Date(2024, 1, 11),
    name: "Freelance Payment",
    category: "Income",
    amount: 750.0,
    type: "income",
  },
];

const categories = [
  "Shopping",
  "Utilities",
  "Income",
  "Transportation",
  "Entertainment",
  "Healthcare",
  "Education",
  "Housing",
  "Insurance",
  "Other",
];

const SpendingPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>();
  const [transactions, setTransactions] = useState(initialTransactions);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValues, setEditingValues] = useState({
    name: "",
    category: "",
    amount: 0,
  });

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategories =
      selectedCategories.length === 0 ||
      selectedCategories.includes(transaction.category);
    const matchesDateRange =
      !dateRange?.from ||
      !dateRange?.to ||
      (transaction.date >= dateRange.from && transaction.date <= dateRange.to);

    return matchesSearch && matchesCategories && matchesDateRange;
  });

  const startEditing = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditingValues({
      name: transaction.name,
      category: transaction.category,
      amount: transaction.amount,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingValues({ name: "", category: "", amount: 0 });
  };

  const saveEditing = (id: number) => {
    setTransactions(
      transactions.map((t) => (t.id === id ? { ...t, ...editingValues } : t))
    );
    setEditingId(null);
    toast({
      title: "Changes saved",
      description: "Transaction has been updated successfully.",
    });
  };

  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    toast({
      title: "Transaction deleted",
      description: "The transaction has been removed.",
    });
  };

  const exportToCSV = () => {
    const headers = ["Date", "Name", "Category", "Type", "Amount"];
    const csvRows = transactions.map((t) => [
      format(t.date, "yyyy-MM-dd"),
      t.name,
      t.category,
      t.type,
      t.amount.toFixed(2),
    ]);
    const csvContent = [
      headers.join(","),
      ...csvRows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `transactions-${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Export successful",
      description: "Your transactions have been exported to CSV.",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={exportToCSV}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>

          <TransactionFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            categories={categories}
          />

          <div className="bg-white rounded-lg shadow">
            <TransactionsTable
              transactions={filteredTransactions}
              categories={categories}
              editingId={editingId}
              editingValues={editingValues}
              onStartEditing={startEditing}
              onCancelEditing={cancelEditing}
              onSaveEditing={saveEditing}
              onDeleteTransaction={deleteTransaction}
              onEditingValuesChange={setEditingValues}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SpendingPage;
