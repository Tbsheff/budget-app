const UserCategories = require("../models/user_categories");
const Transactions = require("../models/transactions");

// Fetch user-specific categories and budgets
exports.getUserCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    const categories = await UserCategories.findAll({
      where: { user_id: userId },
      attributes: ["category_id", "name", "monthly_budget"],
    });
    return res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch categories" });
  }
};

// Fetch transactions for a specific date range
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    const transactions = await Transactions.findAll({
      where: {
        user_id: userId,
        transaction_date: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
      attributes: ["transaction_id", "category_id", "amount", "description"],
    });

    return res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch transactions" });
  }
};
