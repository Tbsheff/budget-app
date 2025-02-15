import { useState, useEffect } from "react";
import {
  Plus,
  Upload,
  Camera,
  DollarSign,
  Calendar,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/Sidebar";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import OpenAI from "openai";

const TransactionsPage = () => {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [extractedData, setExtractedData] = useState({
    amount: "",
    description: "",
    category_id: "",
    transaction_date: "",
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch categories from backend on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/user-categories", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Filter out "Earnings" from categories
        const filteredCategories = response.data.filter(
          (category) => category.name.toLowerCase() !== "earnings"
        );
        setCategories(filteredCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "Failed to fetch categories. Please try again.",
        });
      }
    };

    fetchCategories();
  }, []);

  const handleFileClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const transactionData = {
        category_id: parseInt(categoryId),
        amount: parseFloat(amount),
        description,
        transaction_date: transactionDate,
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
      setTransactionDate("");
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

  const handleConfirmTransaction = () => {
    // Save the transaction with extracted/edited data
    console.log("Saving transaction:", extractedData);
    setIsSubmitting(true);

    const saveTransaction = async () => {
      try {
        await axios.post("/api/expenses", extractedData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        toast({
          title: "Transaction Added",
          description: "Your transaction has been successfully added.",
        });
      } catch (error) {
        console.error("Error adding transaction:", error);
        toast({
          title: "Error",
          description: "Failed to add the transaction. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
        setShowConfirmDialog(false);
        setSelectedFile(null);
        setImageUrl(null);
      }
    };

    saveTransaction();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Content = reader.result.split(",")[1]; // Remove the data URL prefix

      try {
        setIsUploading(true);
        const response = await axios.post(
          "/api/receipts/analyze",
          { base64Content },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("Invoice analysis result:", response.data); // Log the response data for debugging

        const { total, rawData } = response.data;
        const items = rawData.Items?.valueArray || [];
        const description = items
          .map((item) => item.valueObject.Description.valueString)
          .join(", ");
        const merchant = rawData.MerchantName?.valueString || "";

        // Prepare data for OpenAI API
        const openAIRequestData = {
          amount: total,
          description,
          merchant,
          categories: categories.map((cat) => ({
            id: cat.category_id,
            name: cat.name,
          })),
          budgetGroups: categories.map((cat) => cat.budget_group),
        };

        const openai = new OpenAI({
          apiKey: import.meta.env.VITE_OPENAI_API_KEY,
          dangerouslyAllowBrowser: true,
        });

        const prompt = `Categorize the following transaction based on the user's budget groups and categories:\n\n${JSON.stringify(openAIRequestData)}
        Format the response as JSON with the following structure:
    {
      "transactions": [
        {
          "merchant": "string",
          "category_id": "integer",
          "amount": "number",
          "transaction_date": "date",
          ]
        }
      ]
      }`;

        const completion = await openai.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "gpt-3.5-turbo",
          response_format: { type: "json_object" },
        });

        const categorizedData = JSON.parse(
          completion.choices[0].message.content
        );
        console.log(categorizedData);

        // Update state with categorized data
        setExtractedData({
          amount: categorizedData.transactions[0].amount || "",
          description: categorizedData.transactions[0].merchant || "",
          category_id: categorizedData.transactions[0].category_id || "",
          transaction_date:
            categorizedData.transactions[0].transaction_date || "",
        });

        setShowConfirmDialog(true);

        toast({
          title: "Receipt Analyzed",
          description: "Your receipt has been successfully analyzed.",
        });
      } catch (error) {
        console.error("Error analyzing receipt:", error);
        toast({
          title: "Error",
          description: "Failed to analyze the receipt. Please try again.",
        });
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(selectedFile);
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

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((category) => (
                      <option
                        key={category.category_id}
                        value={category.category_id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transactionDate">Transaction Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="transactionDate"
                      type="date"
                      className="pl-10"
                      value={transactionDate}
                      onChange={(e) => setTransactionDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
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
                    <label htmlFor="fileInput" className="cursor-pointer">
                      <Button
                        variant="outline"
                        className="mx-auto"
                        onClick={handleFileClick}
                      >
                        Upload Receipt
                        <Upload className="ml-2 h-4 w-4" />
                      </Button>
                    </label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="fileInput"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Drag and drop or click to upload
                  </p>
                </div>

                <div className="relative border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                  <div className="flex justify-center">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      className="mx-auto"
                      onClick={handleFileUpload}
                    >
                      Analyze Receipt
                      <Camera className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Use your camera to capture receipt
                  </p>
                </div>
              </div>
              {selectedFile && (
                <div id="file-name" className="text-sm text-gray-500">
                  Selected: {selectedFile.name}
                </div>
              )}
              {selectedFile && (
                <Button
                  className="w-full animate-fade-in"
                  onClick={handleFileUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Receipt...
                    </>
                  ) : (
                    "Submit Receipt"
                  )}
                </Button>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Transaction Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {imageUrl && (
              <div className="space-y-2">
                <Label>Receipt Image</Label>
                <img src={imageUrl} alt="Receipt" className="w-full h-auto" />
              </div>
            )}
            <div className="space-y-2">
              <Label>Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  type="number"
                  step="0.01"
                  value={extractedData.amount}
                  onChange={(e) =>
                    setExtractedData({
                      ...extractedData,
                      amount: e.target.value,
                    })
                  }
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Merchant</Label>
              <Input
                value={extractedData.description}
                onChange={(e) =>
                  setExtractedData({
                    ...extractedData,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={extractedData.category_id}
                onValueChange={(value) =>
                  setExtractedData({ ...extractedData, category_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.category_id} value={cat.category_id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Transaction Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  type="date"
                  value={
                    extractedData.transaction_date
                      ? new Date(extractedData.transaction_date)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setExtractedData({
                      ...extractedData,
                      transaction_date: e.target.value,
                    })
                  }
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmTransaction}>Save Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionsPage;
