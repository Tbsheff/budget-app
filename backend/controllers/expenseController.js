const Transactions = require("../models/transactions");
const UserCategories = require("../models/user_categories");
const sequelize = require("../config/db").sequelize;
const { Op } = require("sequelize");

// Fetch aggregated expenses by category for a specific date range
exports.getAggregatedExpenses = async (req, res) => {
  try {

    const userId = req.user.id; // Ensure the correct reference
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start and end dates are required." });
    }

    const aggregatedExpenses = await Transactions.findAll({
      where: {
        user_id: userId, // Ensure correct user filtering
        transaction_date: { [Op.between]: [startDate, endDate] },
      },
      attributes: ["category_id", [sequelize.fn("SUM", sequelize.col("amount")), "total_amount"]],
      group: ["category_id"],
    });

    res.status(200).json(aggregatedExpenses);
  } catch (error) {
    console.error("❌ Error fetching aggregated expenses:", error);
    res.status(500).json({ message: "Failed to fetch aggregated expenses." });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all transactions for the user
    const expenses = await Transactions.findAll({
      where: { user_id: userId },
      attributes: ["transaction_id", "description", "amount", "transaction_date", "category_id"],
    });

    // Fetch all user categories
    const categories = await UserCategories.findAll({
      where: { user_id: userId },
      attributes: ["category_id", "name"],
    });

    // Create a category lookup object
    const categoryMap = {};
    categories.forEach((category) => {
      categoryMap[category.category_id] = category.name;
    });

    // Attach category names to expenses
    const formattedExpenses = expenses.map((expense) => ({
      transaction_id: expense.transaction_id,
      description: expense.description,
      amount: Number(expense.amount), // Ensure it's a number
      transaction_date: expense.transaction_date,
      category_name: categoryMap[expense.category_id], // Default if missing
    }));

    res.status(200).json(formattedExpenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Failed to fetch expenses." });
  }
};


// Fetch a specific expense by ID
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Transactions.findOne({
      where: { transaction_id: req.params.id, user_id: req.user.id },
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }

    res.status(200).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch expense." });
  }
};

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { category_id, amount, description, transaction_date } = req.body;

    const newExpense = await Transactions.create({
      user_id: req.user.id,
      category_id,
      amount,
      description,
      transaction_date,
      created_at: new Date(),
    });

    res.status(201).json(newExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create expense." });
  }
};

// Update an existing expense
exports.updateExpense = async (req, res) => {
  try {
    const { category_id, amount, description, transaction_date } = req.body;

    const updatedExpense = await Transactions.update(
      { category_id, amount, description, transaction_date },
      { where: { transaction_id: req.params.id, user_id: req.user.id } }
    );

    if (!updatedExpense[0]) {
      return res.status(404).json({ message: "Expense not found or not updated." });
    }

    res.status(200).json({ message: "Expense updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update expense." });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const deleted = await Transactions.destroy({
      where: { transaction_id: req.params.id, user_id: req.user.id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Expense not found." });
    }

    res.status(200).json({ message: "Expense deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete expense." });
  }
};
