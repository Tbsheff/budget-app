import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface ExpenseFormData {
  category_id: number;
  amount: string;
  description: string;
  transaction_date: string;
}

interface Category {
  category_id: number;
  name: string;
}

const Expense: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<ExpenseFormData>({
    category_id: 0,
    amount: "",
    description: "",
    transaction_date: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
    if (id) {
      setIsEditMode(true);
      fetchExpenseData(id);
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/user-categories", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchExpenseData = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFormData(response.data);
    } catch (error) {
      console.error("Failed to fetch expense data:", error);
    }
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.category_id) errors.push("Category is required.");
    if (!formData.amount || isNaN(Number(formData.amount)))
      errors.push("Valid amount is required.");
    if (!formData.transaction_date) errors.push("Transaction date is required.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/expenses/${id}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        await axios.post("http://localhost:5000/api/expenses", formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
      navigate("/expenses");
    } catch (error) {
      console.error("Failed to submit expense:", error);
      setErrors(["Failed to save the expense. Please try again."]);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      navigate("/expenses");
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">
          {isEditMode ? "Edit Expense" : "Add Expense"}
        </h2>
        {errors.length > 0 && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              id="description"
              name="description"
              type="text"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="transaction_date" className="block text-sm font-medium text-gray-700">
              Transaction Date
            </label>
            <input
              id="transaction_date"
              name="transaction_date"
              type="date"
              value={formData.transaction_date}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 font-medium text-white bg-primary rounded hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isEditMode ? "Update Expense" : "Add Expense"}
            </button>
            {isEditMode && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Expense
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Expense;
