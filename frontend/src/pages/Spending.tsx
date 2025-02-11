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
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"month" | "year">("month");
  const [transactions, setTransactions] = useState(initialTransactions);

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValues, setEditingValues] = useState<{
    name: string;
    category: string;
    amount: number;
    date: Date; // <-- Add date here
  }>({
    name: "",
    category: "",
    amount: 0,
    date: new Date(), // <-- Initialize with the current date
  });
  

  const handleStartEditing = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditingValues({
      name: transaction.name,
      category: transaction.category,
      amount: transaction.amount,
      date: transaction.date ? new Date(transaction.date) : new Date(), // Ensure date is always a Date object
    });
  };
  
  

  const handleCancelEditing = () => {
    setEditingId(null);
    setEditingValues({ name: "", category: "", amount: 0, date: new Date() });
  };

  const handleSaveEditing = (id: number) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...editingValues } : t)));
    setEditingId(null);
    toast({ title: "Transaction Updated", description: "Changes saved successfully!" });
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast({ title: "Transaction Deleted", description: "Transaction has been removed." });
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
              onClick={() => alert("Export logic goes here!")}
            >
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
              transactions={transactions.filter((t) => {
                return (
                  t.date.getFullYear() === selectedDate.getFullYear() &&
                  (viewMode === "month" ? t.date.getMonth() === selectedDate.getMonth() : true) &&
                  selectedCategories.includes(t.category) &&
                  t.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
              })}
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
    </div>
  );
};

export default SpendingPage;
