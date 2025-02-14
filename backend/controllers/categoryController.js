const UserCategories = require("../models/user_categories");

exports.updateCategoryIcon = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { icon_name } = req.body;

        // Ensure the user only updates their own categories
        const category = await UserCategories.findOne({
            where: { category_id: categoryId, user_id: req.user.id },
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found or unauthorized" });
        }

        category.icon_name = icon_name;
        await category.save();

        return res.status(200).json({ message: "Icon updated successfully" });
    } catch (error) {
        console.error("Error updating icon:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};