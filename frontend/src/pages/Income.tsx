import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Income: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"add" | "edit">("add");
  const [incomeId, setIncomeId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<number | undefined>();
  const [payDate, setPayDate] = useState("");
  const [frequency, setFrequency] = useState("One-time");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if we're in edit mode by reading data passed from navigation
    const state = location.state as { mode: "edit"; incomeId: number } | null;
    if (state?.mode === "edit") {
      setMode("edit");
      setIncomeId(state.incomeId);

      // Fetch income data for editing
      const fetchIncome = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/incomes/${state.incomeId}`);
          const { name, amount, payDate, frequency } = response.data;
          setName(name);
          setAmount(amount);
          setPayDate(payDate);
          setFrequency(frequency);
        } catch (err) {
          setError("Failed to load income data for editing.");
        }
      };

      fetchIncome();
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !amount || !payDate || !frequency) {
      setError("All fields are required.");
      return;
    }

    try {
      const payload = { name, amount, payDate, frequency };
      if (mode === "add") {
        await axios.post("http://localhost:5000/api/incomes", payload);
      } else if (mode === "edit" && incomeId) {
        await axios.put(`http://localhost:5000/api/incomes/${incomeId}`, payload);
      }
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to submit the form. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (mode === "edit" && incomeId) {
      try {
        await axios.delete(`http://localhost:5000/api/incomes/${incomeId}`);
        navigate("/dashboard");
      } catch (err) {
        setError("Failed to delete the income record.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">
          {mode === "add" ? "Add Income" : "Edit Income"}
        </h2>
        {error && <div className="text-red-500">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Income Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              id="amount"
              type="number"
              value={amount || ""}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="payDate" className="block text-sm font-medium text-gray-700">
              Pay Date
            </label>
            <input
              id="payDate"
              type="date"
              value={payDate}
              onChange={(e) => setPayDate(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
              Frequency
            </label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="One-time">One-time</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-weekly">Bi-weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-white bg-primary rounded hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {mode === "add" ? "Add Income" : "Update Income"}
            </button>
          </div>
        </form>
        {mode === "edit" && (
          <div>
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 mt-4 font-medium text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Income
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Income;
