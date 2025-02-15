const Transactions = require("../models/transactions");
const UserCategories = require("../models/user_categories");
const { Op, Sequelize } = require("sequelize");

// Fetch analytics data for a specific category
exports.getCategoryAnalytics = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const userId = req.user.id;
    const { timeRange } = req.query;
    const category = await UserCategories.findOne({
      where: { category_id: categoryId, user_id: userId },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Determine date range based on selected time range
    let dateFilter = {};
    const selectedDate = req.query.selectedDate ? new Date(req.query.selectedDate) : new Date();
    // If selected month is in the past, assume last day of the month
    const now = new Date();
    const isCurrentMonth =
      selectedDate.getFullYear() === now.getFullYear() &&
      selectedDate.getMonth() === now.getMonth();
    const isPastMonth = selectedDate < new Date(now.getFullYear(), now.getMonth(), 1);

    const startOfThisMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const endOfThisMonth = isCurrentMonth
      ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), now.getDate()) // Only up to today for current month
      : new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0); // Last day of past months

    switch (timeRange) {
      case "1M":
        dateFilter = {
          [Op.gte]: new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1),
        };
        break;
      case "3M":
        dateFilter = {
          [Op.gte]: new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 3, 1),
        };
        break;
      case "6M":
        dateFilter = {
          [Op.gte]: new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 6, 1),
        };
        break;
      case "1Y":
        dateFilter = {
          [Op.gte]: new Date(selectedDate.getFullYear() - 1, selectedDate.getMonth(), 1),
        };
        break;
      default:
        dateFilter = {}; // Fetch all transactions if "ALL" is selected
    }

    const numMonths = timeRange === "ALL" ? 12 : parseInt(timeRange) || 12;

    const startOfRange = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() - (timeRange === "1M" ? 0 : numMonths - 1),
      1
    );
    const endOfRange = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

    // Fetch transactions grouped by month OR day
    const spendingTrendsRaw = await Transactions.findAll({
      where: {
        category_id: categoryId,
        user_id: userId,
        transaction_date: { [Op.between]: [startOfRange, endOfRange] },
      },
      attributes: [
        [
          Sequelize.fn(
            "DATE_FORMAT",
            Sequelize.col("transaction_date"),
            timeRange === "1M" ? "%d-%b" : "%b" // ✅ Group by day for 1M, by month otherwise
          ),
          "date_label",
        ],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total_spent"],
      ],
      group: ["date_label"],
      order: [["date_label", "ASC"]],
      raw: true,
    });

    // ✅ Generate labels based on selected time range
    const monthLabels =
    timeRange === "1M"
      ? Array.from({ length: endOfThisMonth.getDate() }, (_, i) => {
          const day = i + 1; // ✅ Generates labels for every day (1, 2, 3, ...)
          return `${String(day).padStart(2, "0")}-${selectedDate.toLocaleDateString("en-GB", { month: "short" })}`;
          // ✅ Matches DB format (e.g., "07-Feb", "10-Feb")
        })
      : Array.from({ length: numMonths }, (_, i) => {
          const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - i, 1);
          return date.toLocaleDateString("en-US", { month: "short" });
        }).reverse();

    // ✅ Create lookup map for spending data
    const spendingMap = spendingTrendsRaw.reduce((acc, entry) => {
      const dbKey = entry.date_label.trim(); // ✅ Ensure it is consistent with monthLabels
      console.log(`🔍 Mapping DB Date: ${dbKey} → ${entry.total_spent}`);
      acc[dbKey] = parseFloat(entry.total_spent);
      return acc;
    }, {});    

    // ✅ Ensure all months/days are included in spendingTrends
    const spendingTrends = monthLabels.map((label) => {
      console.log(`🔍 Checking for label: ${label}, found in spendingMap:`, spendingMap[label]);
      return spendingMap[label] || 0; // ✅ Ensures every label gets mapped correctly
    });    

    // Assign budget values for all labels
    const budgets = monthLabels.map(() => parseFloat(category.monthly_budget));

    // Fetch transactions for the category within the selected time range
    const transactions = await Transactions.findAll({
      where: {
        category_id: categoryId,
        user_id: userId,
        transaction_date: {
          [Op.between]: [startOfThisMonth, endOfThisMonth], // ✅ Uses selectedDate!
        },
      },
      order: [["transaction_date", "ASC"]],
      attributes: ["transaction_id", "description", "amount", "transaction_date"], // Ensure the necessary fields are fetched
    });

    // Debugging log
    console.log("📊 Transactions Fetched:", transactions);

    // Compute analytics data
    const totalSpent = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const budgetAmount = parseFloat(category.monthly_budget);
    const remainingBudget = budgetAmount - totalSpent;
    const percentageUsed = budgetAmount > 0 ? (totalSpent / budgetAmount) * 100 : 0;

    // Calculate monthly spending trend (compared to previous period)
    const startOfLastMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
    const endOfLastMonth = isCurrentMonth
      ? new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, now.getDate()) // Compare only up to today for last month
      : new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 0); // Compare full month for past months

    const previousTransactions = await Transactions.findAll({
      where: {
        category_id: categoryId,
        user_id: userId,
        transaction_date: {
          [Op.between]: [startOfLastMonth, endOfLastMonth], // ✅ Uses selectedDate!
        },
      },
    });

    const previousTotalSpent = previousTransactions.reduce(
      (sum, t) => sum + parseFloat(t.amount),
      0
    );

    const monthlyTrend =
      previousTotalSpent > 0
        ? ((totalSpent - previousTotalSpent) / previousTotalSpent) * 100
        : totalSpent > 0
        ? 100
        : 0;

    const trendLabel = isCurrentMonth
      ? "Compared to this time last month"
      : "Compared to last month";

    console.log("🗓 Selected Date:", selectedDate);
    console.log("📅 Time Range Filter:", dateFilter);
    console.log("📊 Start of This Month:", startOfThisMonth);
    console.log("📊 End of This Month:", endOfThisMonth);
    console.log("📉 Start of Last Month:", startOfLastMonth);
    console.log("📉 End of Last Month:", endOfLastMonth);

    // Format response
    res.json({
      category: category.name,
      totalSpent,
      budgetAmount,
      remainingBudget,
      percentageUsed,
      monthlyTrend,
      transactions,
      trendLabel,
      spendingTrends: {
        labels: monthLabels,
        data: spendingTrends,
        budget: budgets,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching category analytics:", error);
    res.status(500).json({ message: "Error fetching category analytics." });
  }
};
