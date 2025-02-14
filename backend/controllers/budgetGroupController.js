const UserCategories = require("../models/user_categories");
const UserBudgetGroup = require("../models/user_budget_groups");
const sequelize = require('../config/db').sequelize;


exports.getUserBudgetGroups = async (req, res) => {
    try {
      const userId = req.user.id; // Assumes authentication middleware
  
      const budgetGroups = await UserBudgetGroup.findAll({
        where: { user_id: userId },
        attributes: ["budget_group_id", "group_name"],
      });
  
      res.status(200).json(budgetGroups);
    } catch (error) {
      console.error("Error fetching user budget groups:", error);
      res.status(500).json({ message: "Error fetching budget groups." });
    }
  };

exports.saveBudget = async (req, res) => {
  try {
    const { budgetGroups } = req.body;
    const userId = req.user.id;

    for (const group of budgetGroups) {
      const newGroup = await UserBudgetGroup.create({
        group_name: group.group_name,
        user_id: userId,
      });

      for (const category of group.categories) {
        await UserCategories.create({
          user_id: userId,
          name: category.name,
          monthly_budget: category.monthly_budget,
          icon_name: category.icon_name,
          icon_color: category.icon_color,
          budget_group_id: newGroup.budget_group_id,
        });
      }
    }

    res.status(201).json({ message: "Budget saved successfully" });
  } catch (error) {
    console.error("Error saving budget:", error);
    res.status(500).json({ message: "Failed to save budget" });
  }
};