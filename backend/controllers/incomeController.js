const Income = require('../models/Income');

exports.addIncome = async (req, res) => {
    try {
        const { source, amount, frequency } = req.body;
        const newIncome = await Income.create({
            user: req.user.id,
            source,
            amount,
            frequency
        });
        return res.status(201).json(newIncome);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};

exports.getIncomes = async (req, res) => {
    try {
        const incomes = await Income.find({ user: req.user.id });
        return res.status(200).json(incomes);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteIncome = async (req, res) => {
    try {
        const { id } = req.params;
        await Income.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Income deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};
