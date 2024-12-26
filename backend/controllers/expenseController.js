const Expense = require('../models/Expense');

exports.addExpense = async (req, res) => {
    try {
        const { category, description, amount, date, frequency, isRecurring } = req.body;
        const expense = await Expense.create({
            user: req.user.id,
            category,
            description,
            amount,
            date,
            frequency,
            isRecurring
        });
        return res.status(201).json(expense);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id });
        return res.status(200).json(expenses);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        await Expense.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};
