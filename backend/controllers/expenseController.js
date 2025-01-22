const Transactions = require("../models/transactions");

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
