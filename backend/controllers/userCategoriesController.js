const UserCategories = require("../models/user_categories");
const BudgetHistory = require("../models/budget_history");
const UserBudgetGroups = require("../models/user_budget_groups");
const { Op } = require("sequelize");

exports.getUserCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_date } = req.query; // Expecting YYYY-MM format

    // if (!current_date) {
    //   return res.status(400).json({ message: "current_date is required." });
    // }

    const currentMonthYear = new Date().toISOString().slice(0, 7); // Format YYYY-MM

    let categories;

    if (current_date < currentMonthYear) {
      // Fetch past budget data from budget_history
      categories = await BudgetHistory.findAll({
        where: { user_id: userId, month_year: current_date },
        include: [
          {
            model: UserCategories,
            as: "category",
            include: [
              {
                model: UserBudgetGroups,
                as: "budget_group",
                attributes: ["budget_group_id", "group_name"],
              },
            ],
          },
        ],
      });

      // Transform data to match the user_categories format
      categories = categories.map((record) => ({
        category_id: record.category_id,
        user_id: record.user_id,
        name: record.category?.name || "Unknown",
        monthly_budget: parseFloat(record.monthly_budget) || 0,
        icon_name: record.category?.icon_name || "MoreHorizontal",
        icon_color: record.category?.icon_color || "text-gray-500",
        budget_group: record.category?.budget_group || null,
      }));
    } else {
      // Fetch current budget from user_categories
      categories = await UserCategories.findAll({
        where: { user_id: userId },
        include: [
          {
            model: UserBudgetGroups,
            as: "budget_group",
            attributes: ["budget_group_id", "group_name"],
          },
        ],
      });
    }

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching user categories." });
  }
};



// Fetch a single category by ID
exports.getUserCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const category = await UserCategories.findOne({
      where: { category_id: id, user_id: userId },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Error fetching user category." });
  }
};

// Create a new category
exports.addUserCategory = async (req, res) => {
  try {
    const { name, monthly_budget, icon_name, icon_color } = req.body;
    const userId = req.user.id;

    const newCategory = await UserCategories.create({
      user_id: userId,
      name,
      monthly_budget,
      icon_name,
      icon_color,
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Error adding user category." });
  }
};

// Update an existing category
exports.updateUserCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, monthly_budget, icon_name, icon_color } = req.body;
    const userId = req.user.id;

    const category = await UserCategories.findOne({
      where: { category_id: id, user_id: userId },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    category.name = name || category.name;
    category.monthly_budget = monthly_budget || category.monthly_budget;
    category.icon_name = icon_name || category.icon_name;
    category.icon_color = icon_color || category.icon_color;

    await category.save();

    res.status(200).json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Error updating user category." });
  }
};

// Delete a category
exports.deleteUserCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const category = await UserCategories.findOne({
      where: { category_id: id, user_id: userId },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    await category.destroy();

    res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Error deleting user category." });
  }
};

// Create a new user category within an existing budget group
exports.createUserCategory = async (req, res) => {
  try {
      const { name, budget_group_id, monthly_budget, icon_name, icon_color } = req.body;
      const userId = req.user.id;

      if (!name || !budget_group_id) {
          return res.status(400).json({ message: "Category name and budget group ID are required." });
      }

      const newCategory = await UserCategories.create({
          user_id: userId,
          name,
          budget_group_id, // ✅ Ensure this is being saved
          monthly_budget: monthly_budget || 0,
          icon_name: icon_name || "MoreHorizontal",
          icon_color: icon_color || "text-gray-500",
      });

      res.status(201).json(newCategory); // ✅ Return budget_group_id in response
  } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category." });
  }
};