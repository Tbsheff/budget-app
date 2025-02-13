const UserCategories = require("../models/user_categories");
const UserBudgetGroup = require("../models/user_budget_groups");
const sequelize = require('../config/db').sequelize;

// Create a new budget group
exports.createBudgetGroup = async (req, res) => {
    try {
      const { group_name } = req.body;
      const userId = req.user.id; // ✅ Ensure `user_id` comes from `req.user`
  
      if (!group_name) {
        return res.status(400).json({ message: "Group name is required." });
      }
  
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized: No user ID found." });
      }
  
      const newGroup = await UserBudgetGroup.create({
        user_id: userId, // ✅ Ensure this is included
        group_name,
      });
  
      console.log("✅ Successfully Created Budget Group:", newGroup.toJSON()); // ✅ Debugging
  
      res.status(201).json(newGroup);
    } catch (error) {
      console.error("❌ Error creating budget group:", error);
      res.status(500).json({ message: "Failed to create budget group." });
    }
  };
  

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
