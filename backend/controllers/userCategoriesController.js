const UserCategories = require("../models/user_categories");
const UserBudgetGroups = require("../models/user_budget_groups");

// Fetch all categories for a specific user and include budget group information
exports.getUserCategories = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the request

    const categories = await UserCategories.findAll({
      where: { user_id: userId },
      include: [
        {
          model: UserBudgetGroups, // ✅ Correctly join budget groups
          as: "budget_group",
          attributes: ["budget_group_id", "group_name"], // ✅ Ensure group name is included
        },
      ],
    });
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
    const userId = req.user.id; // ✅ Get user ID from auth middleware

    if (!name || !budget_group_id) {
      return res.status(400).json({ message: "Category name and budget group are required." });
    }

    // ✅ Ensure that the budget_group_id exists for this user
    const userBudgetGroup = await UserBudgetGroups.findOne({
      where: { user_id: userId, budget_group_id },
    });

    if (!userBudgetGroup) {
      return res.status(400).json({ message: "Invalid budget group for this user." });
    }

    // ✅ Create the new category with the correct budget_group_id
    const newCategory = await UserCategories.create({
      user_id: userId,
      name,
      budget_group_id,
      monthly_budget: monthly_budget || 0,
      icon_name: icon_name || "MoreHorizontal",
      icon_color: icon_color || "text-gray-500",
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating user category:", error);
    res.status(500).json({ message: "Failed to create category." });
  }
};