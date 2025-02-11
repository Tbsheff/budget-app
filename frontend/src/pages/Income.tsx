import { useState } from "react";
import { Plus, Upload, Camera, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Sidebar } from "@/components/Sidebar";
import axios from "axios";
import { useToast } from "../components/ui/use-toast";

const IncomePage = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("");
  const [payDate, setPayDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const incomeData = {
        name,
        amount: parseFloat(amount),
        frequency,
        pay_date: payDate,
      };

      await axios.post("/api/incomes", incomeData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast({
        title: "Income Added",
        description: "Your income has been successfully added.",
      });

      setName("");
      setAmount("");
      setFrequency("");
      setPayDate("");
    } catch (error) {
      console.error("Error adding income:", error);
      toast({
        title: "Error",
        description: "Failed to add the income. Please try again.",
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
          <h1 className="text-2xl font-bold mb-8">Add Income</h1>

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
                  <Label htmlFor="name">Income Source</Label>
                  <Input
                    id="name"
                    placeholder="Enter income source (e.g., Job, Freelancing)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

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
                  <Label htmlFor="frequency">Frequency</Label>
                  <select
                    id="frequency"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    required
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="" disabled>Select frequency</option>
                    <option value="One-time">One-time</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-weekly">Bi-weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payDate">Pay Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="payDate"
                      type="date"
                      className="pl-10"
                      value={payDate}
                      onChange={(e) => setPayDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Income"}
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

export default IncomePage;
