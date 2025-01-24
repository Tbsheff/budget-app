const UserCategories = require("../models/user_categories");
const Transactions = require("../models/transactions");

// Fetch user categories with budget and spending
exports.getUserCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    const categories = await UserCategories.findAll({
      where: { user_id: userId },
    });

    const transactions = await Transactions.findAll({
      where: {
        user_id: userId,
        transaction_date: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
      },
    });

    const categoriesWithSpent = categories.map((category) => {
      const spent = transactions
        .filter((t) => t.category_id === category.category_id)
        .reduce((sum, t) => sum + Number(t.amount), 0);
      return { ...category.toJSON(), spent };
    });

    res.status(200).json(categoriesWithSpent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

// Fetch budget summary
exports.getBudgetSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    const income = await Transactions.sum("amount", {
      where: {
        user_id: userId,
        category_id: null, // Assume null category_id indicates income
        transaction_date: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
      },
    });

    const expenses = await Transactions.sum("amount", {
      where: {
        user_id: userId,
        category_id: { [Op.not]: null }, // Non-null category_id indicates expenses
        transaction_date: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
      },
    });

    const remaining = income - expenses;

    res.status(200).json({
      income,
      expenses,
      remaining,
      dailyBudget: remaining / (endOfMonth.getDate() - new Date().getDate() + 1),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch budget summary" });
  }
};
