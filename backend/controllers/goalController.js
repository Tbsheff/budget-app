const Goal = require('../models/Goal');

exports.addGoal = async (req, res) => {
    try {
        const { title, targetAmount, deadline } = req.body;
        const newGoal = await Goal.create({
            user: req.user.id,
            title,
            targetAmount,
            deadline
        });
        return res.status(201).json(newGoal);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};

exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.id });
        return res.status(200).json(goals);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentAmount } = req.body;
        const updatedGoal = await Goal.findByIdAndUpdate(
            id,
            { currentAmount },
            { new: true }
        );
        return res.status(200).json(updatedGoal);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};
