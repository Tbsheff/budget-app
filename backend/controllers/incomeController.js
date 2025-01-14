const Income = require("../models/income");

// Get all incomes for a user
exports.getIncomes = async (req, res) => {
  try {
    const incomes = await Income.findAll({ where: { user_id: req.user.id } });
    return res.status(200).json(incomes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Add a new income
exports.addIncome = async (req, res) => {
  try {
    const { name, amount, frequency, pay_date } = req.body;

    // Create the income record, including pay_date
    const newIncome = await Income.create({
      user_id: req.user.id, // Set user_id from the authenticated user
      name,
      amount,
      frequency,
      pay_date, // Provided by the user
    });

    return res.status(201).json(newIncome);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Update an income
exports.updateIncome = async (req, res) => {
  try {
    const { income_id } = req.params;
    const updates = req.body;

    // Ensure the user only updates their own incomes
    const updated = await Income.update(updates, {
      where: { id: income_id, user_id: req.user.id },
    });

    if (updated[0] === 0) {
      return res.status(404).json({ message: "Income not found or unauthorized" });
    }

    return res.status(200).json({ message: "Income updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Delete an income
exports.deleteIncome = async (req, res) => {
  try {
    const { income_id } = req.params;

    // Ensure the user only deletes their own incomes
    const deleted = await Income.destroy({
      where: { id: income_id, user_id: req.user.id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Income not found or unauthorized" });
    }

    return res.status(200).json({ message: "Income deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get a single income by ID
exports.getIncomeById = async (req, res) => {
  try {
    const { income_id } = req.params;

    // Ensure the user only fetches their own incomes
    const income = await Income.findOne({
      where: { id: income_id, user_id: req.user.id },
    });

    if (!income) {
      return res.status(404).json({ message: "Income not found or unauthorized" });
    }

    return res.status(200).json(income);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};
