const UserCategories = require("../models/user_categories");

// Fetch all categories for a specific user
exports.getUserCategories = async (req, res) => {
  try {
    const userId = req.user.id; // Assumes `authMiddleware` sets `req.user`
    const categories = await UserCategories.findAll({
      where: { user_id: userId },
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
