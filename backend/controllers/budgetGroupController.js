const UserCategories = require("../models/user_categories");
const BudgetGroup = require("../models/budget_groups");
const sequelize = require('../config/db').sequelize;

// Create a new budget group
exports.createBudgetGroup = async (req, res) => {
    try {
        const { group_name } = req.body;
        if (!group_name) {
            return res.status(400).json({ message: "Group name is required." });
        }

        const newGroup = await BudgetGroup.create({ group_name }); // ✅ Corrected this line

        res.status(201).json(newGroup);
    } catch (error) {
        console.error("Error creating budget group:", error);
        res.status(500).json({ message: "Failed to create budget group." });
    }
};
