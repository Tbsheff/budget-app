import { useState, useEffect, useRef } from "react";
import { Plus, Upload, Camera, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/Sidebar";
import axios from "axios";
import { useToast } from "../components/ui/use-toast";

const TransactionsPage = () => {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/user-categories", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "Failed to fetch categories. Please try again.",
        });
      }
    };

    fetchCategories();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCategorySelect = (id) => {
    setCategoryId(String(id));
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const transactionData = {
        category_id: parseInt(categoryId),
        amount: parseFloat(amount),
        description,
        transaction_date: new Date().toISOString(),
      };

      await axios.post("/api/expenses", transactionData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast({
        title: "Transaction Added",
        description: "Your transaction has been successfully added.",
      });

      setAmount("");
      setDescription("");
      setCategoryId("");
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Error",
        description: "Failed to add the transaction. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Add Transaction</h1>

          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="manual">
                <Plus className="w-4 h-4 mr-2" />
                Manual Entry
              </TabsTrigger>
              <TabsTrigger value="receipt">
                <Upload className="w-4 h-4 mr-2" />
                Upload Receipt
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-10"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Enter transaction description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2 relative" ref={dropdownRef}>
                  <Label htmlFor="category">Category</Label>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="w-full p-2 border rounded-md text-left bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    {categoryId
                      ? categories.find((cat) => cat.category_id === parseInt(categoryId))?.name ||
                        "Select a category"
                      : "Select a category"}
                  </button>

                  {isDropdownOpen && (
                    <ul className="absolute z-10 w-full border bg-white rounded-md shadow-lg max-h-48 overflow-auto mt-2">
                      {categories.map((category) => (
                        <li
                          key={category.category_id}
                          className={`p-2 hover:bg-indigo-500 hover:text-white cursor-pointer ${
                            parseInt(categoryId) === category.category_id ? "bg-indigo-100" : ""
                          }`}
                          onClick={() => handleCategorySelect(category.category_id)}
                        >
                          {category.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Transaction"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="receipt" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                  <div className="flex justify-center">
                    <Upload className="h-12 w-12 text-gray-400" />
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      className="mx-auto cursor-not-allowed opacity-50"
                      disabled
                    >
                      Upload Receipt
                      <Upload className="ml-2 h-4 w-4" />
                    </Button>
                    <p className="text-sm text-indigo-600 mt-2">Coming Soon</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Drag and drop or click to upload (feature under development)
                  </p>
                </div>

                <div className="relative border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                  <div className="flex justify-center">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      className="mx-auto cursor-not-allowed opacity-50"
                      disabled
                    >
                      Take Photo
                      <Camera className="ml-2 h-4 w-4" />
                    </Button>
                    <p className="text-sm text-indigo-600 mt-2">Coming Soon</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Use your camera to capture receipt (feature under development)
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default TransactionsPage;
