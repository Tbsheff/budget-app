const Transactions = require("../models/transactions");
const sequelize = require("../config/db").sequelize; 
const { Op } = require("sequelize");

// Fetch aggregated expenses by category for a specific date range
exports.getAggregatedExpenses = async (req, res) => {
  try {
    console.log("🔹 Received request for aggregated expenses");

    const userId = req.user.id; // Ensure the correct reference
    const { startDate, endDate } = req.query;

    console.log("🔹 Query Params:", { userId, startDate, endDate });

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

    console.log("🔹 Aggregated Data:", aggregatedExpenses);

    res.status(200).json(aggregatedExpenses);
  } catch (error) {
    console.error("❌ Error fetching aggregated expenses:", error);
    res.status(500).json({ message: "Failed to fetch aggregated expenses." });
  }
};

// Fetch all expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Transactions.findAll({ where: { user_id: req.user.id } });
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
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
