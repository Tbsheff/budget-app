const UserSubcategories = require("../models/user_subcategories");

// Add a new subcategory
exports.addSubcategory = async (req, res) => {
  try {
    const { user_id, category_id, name } = req.body;

    const newSubcategory = await UserSubcategories.create({
      user_id,
      category_id,
      name,
    });

    res.status(201).json(newSubcategory);
  } catch (error) {
    console.error("Error adding subcategory:", error);
    res.status(500).json({ message: "Error adding subcategory" });
  }
};

// Get a specific subcategory by ID
exports.getSubcategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const subcategory = await UserSubcategories.findByPk(id);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    res.status(200).json(subcategory);
  } catch (error) {
    console.error("Error fetching subcategory by ID:", error);
    res.status(500).json({ message: "Error fetching subcategory" });
  }
};

// Get subcategories for a user or category
exports.getSubcategories = async (req, res) => {
  try {
    const { user_id, category_id } = req.query;

    const filters = {};
    if (user_id) filters.user_id = user_id;
    if (category_id) filters.category_id = category_id;

    const subcategories = await UserSubcategories.findAll({ where: filters });
    res.status(200).json(subcategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ message: "Error fetching subcategories" });
  }
};

// Update a subcategory
exports.updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const subcategory = await UserSubcategories.findByPk(id);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    subcategory.name = name;
    await subcategory.save();

    res.status(200).json(subcategory);
  } catch (error) {
    console.error("Error updating subcategory:", error);
    res.status(500).json({ message: "Error updating subcategory" });
  }
};

// Delete a subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;

    const subcategory = await UserSubcategories.findByPk(id);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    await subcategory.destroy();
    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(500).json({ message: "Error deleting subcategory" });
  }
};
