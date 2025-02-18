const Transactions = require("../models/transactions");
const UserCategories = require("../models/user_categories");
const BudgetHistory = require("../models/budget_history");
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

    const firstTransaction = await Transactions.findOne({
      where: { user_id: userId },
      order: [["transaction_date", "ASC"]],
      attributes: ["transaction_date"],
    });

    const getStartDate = (range, selectedDate) => {
      switch (range) {
        case "3M":
          return new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 3, 1);
        case "6M":
          return new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 6, 1);
        case "1Y":
          return new Date(selectedDate.getFullYear() - 1, selectedDate.getMonth(), 1);
        case "ALL":
          return firstTransaction ? new Date(firstTransaction.transaction_date) : null;
        default:
          return null;
      }
    };

    const numMonths = (() => {
      switch (timeRange) {
        case "3M":
          return 3;
        case "6M":
          return 6;
        case "1Y":
          return 12;
        case "ALL":
          if (firstTransaction) {
            const firstDate = new Date(firstTransaction.transaction_date);
            return (
              (selectedDate.getFullYear() - firstDate.getFullYear()) * 12 +
              (selectedDate.getMonth() - firstDate.getMonth()) +
              1
            );
          }
          return 12;
        default:
          return 12;
      }
    })();

    const startOfRange = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() - (numMonths - 1),
      1
    );
    const endOfRange = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

    dateFilter = { [Op.between]: [startOfRange, endOfRange] };

    let spendingTrendsRaw, monthLabels, spendingMap, spendingTrends;

    if (timeRange === "ALL") {
      // ✅ "ALL" → Group by both month & year (e.g., "Jan 2022", "Feb 2022", ...)
      spendingTrendsRaw = await Transactions.findAll({
        where: {
          category_id: categoryId, // Ensure this is correctly filtering transactions
          user_id: userId,
          transaction_date: { [Op.between]: [startOfRange, endOfRange] },
        },
        attributes: [
          [Sequelize.fn("DATE_FORMAT", Sequelize.col("transaction_date"), "%b %Y"), "date_label"],
          [Sequelize.fn("SUM", Sequelize.col("amount")), "total_spent"],
        ],
        group: ["date_label"],
        order: [[Sequelize.fn("MIN", Sequelize.col("transaction_date")), "ASC"]], // ✅ Ensures chronological order
        raw: true,
      });

      // ✅ Generate labels from first transaction to today
      const firstDate = new Date(firstTransaction.transaction_date);
      const totalMonths =
        (selectedDate.getFullYear() - firstDate.getFullYear()) * 12 +
        (selectedDate.getMonth() - firstDate.getMonth()) +
        1;

      // ✅ Generate full list of months (ensures missing months get zero value)
      monthLabels = Array.from({ length: totalMonths }, (_, i) => {
        const date = new Date(firstDate.getFullYear(), firstDate.getMonth() + i, 1);
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" }); // ✅ "Nov 2023", "Dec 2023"
      });

      graphLabels = monthLabels.map((label) => label.split(" ")[0]); // ✅ Extract only "Jan", "Feb"

      spendingMap = spendingTrendsRaw.reduce((acc, entry) => {
        const dbKey = entry.date_label.trim(); // ✅ Ensures exact match
        acc[dbKey] = parseFloat(entry.total_spent);
        return acc;
      }, {});

      // ✅ Ensure spending trends include all months, setting zero if missing
      spendingTrends = monthLabels.map((label) => spendingMap[label] || 0);
    } else {
      // ✅ Regular logic for "1M", "3M", "6M", "1Y"
      spendingTrendsRaw = await Transactions.findAll({
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
              timeRange === "1M" ? "%d-%b" : "%b" // ✅ "07-Feb" for "1M", "Jan" for others
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
      monthLabels = Array.from({ length: numMonths }, (_, i) => {
        const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - i, 1);
        return date.toLocaleDateString("en-US", { month: "short" }); // ✅ "Jan", "Feb", ...
      }).reverse();

      // ✅ Create lookup map for spending data
      spendingMap = spendingTrendsRaw.reduce((acc, entry) => {
        acc[entry.date_label.trim()] = parseFloat(entry.total_spent);
        return acc;
      }, {});

      graphLabels = monthLabels.map((label) => label.split(" ")[0]); // ✅ Extract only "Jan", "Feb"

      // ✅ Ensure all months/days are included
      spendingTrends = monthLabels.map((label) => spendingMap[label] || 0);
    }

    // Fetch budget for each month in the range
    const budgets = await Promise.all(
      [...monthLabels].reverse().map(async (label, index) => {
        const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - index, 1);
        const formattedMonthYear = date.toISOString().slice(0, 7); // Format YYYY-MM

        if (
          date.getFullYear() === new Date().getFullYear() &&
          date.getMonth() === new Date().getMonth()
        ) {
          // ✅ Use user_categories for the current month
          return parseFloat(category.monthly_budget) || 0;
        } else {
          // ✅ Use budget_history for past months
          const pastBudget = await BudgetHistory.findOne({
            where: {
              category_id: categoryId,
              user_id: userId,
              month_year: formattedMonthYear,
            },
          });

          return pastBudget ? parseFloat(pastBudget.monthly_budget) : 0;
        }
      })
    );

    // ✅ Reverse again to match the correct order of `monthLabels`
    budgets.reverse();

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
    const budgetAmount = budgets[budgets.length - 1] || 0;
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

    const calculateMonthlyChanges = (data) => {
      return data.map((amount, index) => {
        if (index === 0) return 0;
        return amount - data[index - 1];
      });
    };

    const monthlyChanges = calculateMonthlyChanges(spendingTrends);

    // Generate full date labels for proper parsing in tooltips
    const fullDateLabels = monthLabels
      .map((label, i) => {
        const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - i, 1);
        return date.toISOString().split("T")[0]; // "YYYY-MM-DD" format
      })
      .reverse();

    // console.log("📊 Spending Trends:", spendingTrends);
    // console.log("📊 Spending Trends:", monthLabels);
    // console.log("📉 Monthly Changes:", monthlyChanges);
    // console.log("🗓 Selected Date:", selectedDate);
    // console.log("📅 Time Range Filter:", dateFilter);
    // console.log("📊 Start of This Month:", startOfThisMonth);
    // console.log("📊 End of This Month:", endOfThisMonth);
    // console.log("📉 Start of Last Month:", startOfLastMonth);
    // console.log("📉 End of Last Month:", endOfLastMonth);
    // console.log("📊 Start of Range:", startOfRange);
    // console.log("📊 End of Range:", endOfRange);

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
        labels: graphLabels,
        fullDateLabels,
        data: spendingTrends,
        budget: budgets,
        changes: monthlyChanges,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching category analytics:", error);
    res.status(500).json({ message: "Error fetching category analytics." });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeRange } = req.query;

    // Fetch user categories excluding "Earnings"
    const categories = await UserCategories.findAll({
      where: {
        user_id: userId,
        name: { [Op.notIn]: ["Earnings", "Income"] },
      },
      attributes: ["category_id", "monthly_budget"],
      raw: true,
    });

    const categoryIds = categories.map((c) => c.category_id);

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

    const firstTransaction = await Transactions.findOne({
      where: { user_id: userId },
      order: [["transaction_date", "ASC"]],
      attributes: ["transaction_date"],
    });

    const getStartDate = (range, selectedDate) => {
      switch (range) {
        case "3M":
          return new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 3, 1);
        case "6M":
          return new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 6, 1);
        case "1Y":
          return new Date(selectedDate.getFullYear() - 1, selectedDate.getMonth(), 1);
        case "ALL":
          return firstTransaction ? new Date(firstTransaction.transaction_date) : null;
        default:
          return null;
      }
    };

    const numMonths = (() => {
      switch (timeRange) {
        case "3M":
          return 3;
        case "6M":
          return 6;
        case "1Y":
          return 12;
        case "ALL":
          if (firstTransaction) {
            const firstDate = new Date(firstTransaction.transaction_date);
            return (
              (selectedDate.getFullYear() - firstDate.getFullYear()) * 12 +
              (selectedDate.getMonth() - firstDate.getMonth()) +
              1
            );
          }
          return 12;
        default:
          return 12;
      }
    })();

    const startOfRange = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() - (numMonths - 1),
      1
    );
    const endOfRange = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

    dateFilter = { [Op.between]: [startOfRange, endOfRange] };

    let spendingTrendsRaw, monthLabels, spendingMap, spendingTrends;

    if (timeRange === "ALL") {
      // ✅ "ALL" → Group by both month & year (e.g., "Jan 2022", "Feb 2022", ...)
      spendingTrendsRaw = await Transactions.findAll({
        where: {
          user_id: userId,
          transaction_date: { [Op.between]: [startOfRange, endOfRange] },
        },
        attributes: [
          [Sequelize.fn("DATE_FORMAT", Sequelize.col("transaction_date"), "%b %Y"), "date_label"],
          [Sequelize.fn("SUM", Sequelize.col("amount")), "total_spent"],
        ],
        group: ["date_label"],
        order: [[Sequelize.fn("MIN", Sequelize.col("transaction_date")), "ASC"]], // ✅ Ensures chronological order
        raw: true,
      });

      // ✅ Generate labels from first transaction to today
      const firstDate = new Date(firstTransaction.transaction_date);
      const totalMonths =
        (selectedDate.getFullYear() - firstDate.getFullYear()) * 12 +
        (selectedDate.getMonth() - firstDate.getMonth()) +
        1;

      // ✅ Generate full list of months (ensures missing months get zero value)
      monthLabels = Array.from({ length: totalMonths }, (_, i) => {
        const date = new Date(firstDate.getFullYear(), firstDate.getMonth() + i, 1);
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" }); // ✅ "Nov 2023", "Dec 2023"
      });

      graphLabels = monthLabels.map((label) => label.split(" ")[0]); // ✅ Extract only "Jan", "Feb"

      spendingMap = spendingTrendsRaw.reduce((acc, entry) => {
        const dbKey = entry.date_label.trim(); // ✅ Ensures exact match
        acc[dbKey] = parseFloat(entry.total_spent);
        return acc;
      }, {});

      // ✅ Ensure spending trends include all months, setting zero if missing
      spendingTrends = monthLabels.map((label) => spendingMap[label] || 0);
    } else {
      // ✅ Regular logic for "1M", "3M", "6M", "1Y"
      spendingTrendsRaw = await Transactions.findAll({
        where: {
          user_id: userId,
          transaction_date: { [Op.between]: [startOfRange, endOfRange] },
        },
        attributes: [
          [
            Sequelize.fn(
              "DATE_FORMAT",
              Sequelize.col("transaction_date"),
              timeRange === "1M" ? "%d-%b" : "%b" // ✅ "07-Feb" for "1M", "Jan" for others
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
      monthLabels = Array.from({ length: numMonths }, (_, i) => {
        const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - i, 1);
        return date.toLocaleDateString("en-US", { month: "short" }); // ✅ "Jan", "Feb", ...
      }).reverse();

      // ✅ Create lookup map for spending data
      spendingMap = spendingTrendsRaw.reduce((acc, entry) => {
        acc[entry.date_label.trim()] = parseFloat(entry.total_spent);
        return acc;
      }, {});

      graphLabels = monthLabels.map((label) => label.split(" ")[0]); // ✅ Extract only "Jan", "Feb"

      // ✅ Ensure all months/days are included
      spendingTrends = monthLabels.map((label) => spendingMap[label] || 0);
    }

    // Fetch transactions for all categories except "Earnings"
    const transactions = await Transactions.findAll({
      where: {
        user_id: userId,
        transaction_date: {
          [Op.between]: [startOfThisMonth, endOfThisMonth], // ✅ Uses selectedDate!
        },
      },
      order: [["transaction_date", "ASC"]],
      attributes: ["transaction_id", "description", "amount", "transaction_date"], // Ensure the necessary fields are fetched
    });

    // Compute total budget and spending
    const totalSpent = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    // Fetch budget for all categories for each month in the range
    const budgets = await Promise.all(
      [...monthLabels].reverse().map(async (label, index) => {
        const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - index, 1);
        const formattedMonthYear = date.toISOString().slice(0, 7); // Format YYYY-MM

        if (
          date.getFullYear() === new Date().getFullYear() &&
          date.getMonth() === new Date().getMonth()
        ) {
          // ✅ Use user_categories for the current month
          const currentTotalBudget = categories.reduce(
            (sum, c) => sum + parseFloat(c.monthly_budget || 0),
            0
          );
          return currentTotalBudget;
        } else {
          // ✅ Use budget_history for past months
          const pastBudgets = await BudgetHistory.findAll({
            where: {
              user_id: userId,
              month_year: formattedMonthYear,
            },
            attributes: ["monthly_budget"],
            raw: true,
          });

          return pastBudgets.reduce((sum, b) => sum + parseFloat(b.monthly_budget || 0), 0);
        }
      })
    );

    // ✅ Reverse again to match the correct order of `monthLabels`
    budgets.reverse();

    // ✅ Use the latest month's budget for calculations
    const totalBudget = budgets[budgets.length - 1] || 0;
    const remainingBudget = totalBudget - totalSpent;
    const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    // Calculate monthly spending trend (compared to previous period)
    const startOfLastMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
    const endOfLastMonth = isCurrentMonth
      ? new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, now.getDate()) // Compare only up to today for last month
      : new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 0); // Compare full month for past months

    const previousTransactions = await Transactions.findAll({
      where: {
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

    const calculateMonthlyChanges = (data) => {
      return data.map((amount, index) => {
        if (index === 0) return 0;
        return amount - data[index - 1];
      });
    };

    const monthlyChanges = calculateMonthlyChanges(spendingTrends);

    // Generate full date labels for proper parsing in tooltips
    const fullDateLabels = monthLabels
      .map((label, i) => {
        const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - i, 1);
        return date.toISOString().split("T")[0]; // "YYYY-MM-DD" format
      })
      .reverse();

    res.json({
      totalSpent,
      budgetAmount: totalBudget,
      remainingBudget,
      percentageUsed,
      monthlyTrend,
      transactions,
      trendLabel,
      spendingTrends: {
        labels: graphLabels,
        fullDateLabels,
        data: spendingTrends,
        budget: budgets,
        changes: monthlyChanges,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard analytics:", error);
    res.status(500).json({ message: "Error fetching dashboard analytics." });
  }
};
