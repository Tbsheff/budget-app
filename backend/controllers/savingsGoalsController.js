const SavingsGoals = require("../models/savings_goals");


exports.createSavingsGoal = async (req, res) => {
  try {
    console.log(req.user);
    const { user_id, name, target_amount, current_amount, deadline } = req.body;
    console.log(req.body);

    if (!user_id || !target_amount) {
      return res.status(400).json({ message: "User ID and target amount are required" });
    }

    const newGoal = await SavingsGoals.create({
      user_id,
      name,
      target_amount,
      current_amount,
      deadline,
      created_at: new Date(),
    });

    res.status(201).json(newGoal);
  } catch (error) {
    console.log(req.body);
    console.error("Error creating savings goal:", error);
    res.status(500).json({ message: "Failed to create savings goal" });
  }
};

exports.getSavingsGoals = async (req, res) => {
  try {
    const userId = req.user.id;

    const goals = await SavingsGoals.findAll({
      where: { user_id: userId },
    });

    res.status(200).json(goals);
  } catch (error) {
    console.error("Error fetching savings goals:", error);
    res.status(500).json({ message: "Error fetching savings goals" });
  }
};

exports.updateSavingsGoal = async (req, res) => {
  try {
    const { id } = req.params; 
    const { name, target_amount, current_amount, deadline } = req.body;
    const userId = req.user.id;

    const goal = await SavingsGoals.findOne({
      where: { goal_id: goal_id, user_id: userId }, 
    });

    if (!goal) {
      return res.status(404).json({ message: "Savings goal not found" });
    }

    if (name !== undefined) goal.name = name;
    if (target_amount !== undefined) goal.target_amount = target_amount;
    if (current_amount !== undefined) goal.current_amount = current_amount;
    if (deadline !== undefined) goal.deadline = deadline;

    await goal.save();

    res.status(200).json({ message: "Savings goal updated successfully", goal });
  } catch (error) {
    console.error("Error updating savings goal:", error);
    res.status(500).json({ message: "Server Error" });
  }
};