const budgetGroups = require('../models/budgetGroupModel');
const userCategories = require('../models/userCategoriesModel');
const categories = require('../models/categoryModel'); // Assuming you have a category model
const sequelize = require('../config/db').sequelize;

// Fetch distinct budget group IDs from user categories and return group names and categories
exports.getDistinctBudgetGroups = async (res) => {
    try {
        // const userId = req.user.id;
        console.log(userId);// Assumes `authMiddleware` sets `req.user`

        // Query distinct budget_group_id from user categories
        const distinctGroupIds = await userCategories.findAll({
            where: { user_id: 2 },
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('budget_group_id')), 'budget_group_id']],
        });
        console.log(distinctGroupIds);
        const groupIds = distinctGroupIds.map(group => group.budget_group_id);

        // Fetch group names and their associated categories for the distinct budget group IDs
        const groups = await budgetGroups.findAll({
            where: { budget_group_id: groupIds },
            attributes: ['budget_group_id', 'group_name'],
            include: [
                {
                    model: categories,
                    as: 'categories',
                    where: { user_id: 2 },
                    required: false, // Include groups even if they have no categories
                },
            ],
        });

        res.status(200).json(groups);
    } catch (error) {
        console.error("Error fetching distinct budget groups:", error);
        res.status(500).json({ message: "Error fetching distinct budget groups." });
    }
};
