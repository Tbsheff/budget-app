const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path"); // Import path module
require("dotenv").config();

const { sequelize } = require("./config/db"); // Destructure the Sequelize instance

const app = express();

const { createMonthlyBudgetSnapshot } = require("./jobs/createMonthlyBudgetSnapshot");

// Run the budget snapshot check on server startup (in case the scheduled job was missed)
(async () => {
  await createMonthlyBudgetSnapshot();
})();

// Import and run the cron job scheduler
require("./jobs/cronJobs");

// Test Sequelize Connection
(async () => {
  try {
    await sequelize.authenticate(); // Authenticate the Sequelize connection
    console.log("Database connected via Sequelize.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1); // Exit the application if the database connection fails
  }
})();

// Middleware
app.use(cors({
  origin: ["https://budget-app-production-2188.up.railway.app"], // Allow frontend domain
  credentials: true, // Allow cookies
}));
app.use(express.json());
app.use(morgan("dev"));

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/incomes", require("./routes/incomeRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/user-categories", require("./routes/userCategoriesRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/subcategories", require("./routes/subcategoriesRoutes"));
app.use("/api/survey", require("./routes/surveyRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/budget-groups", require("./routes/groupRoutes"));
app.use("/api/budget", require("./routes/budgetRoutes"));
app.use("/api/receipts", require("./routes/receiptRoutes"));
app.use("/api/savings-goals", require("./routes/savingsGoalsRoutes"));
app.use("/api/category", require("./routes/categoryAnalyticsRoutes"));
app.use("/api/query", require("./routes/queryRoutes"));

// Detect whether running in Docker or locally
const isDocker = process.env.RUNNING_IN_DOCKER === "true";

// Dynamically set the path
const frontendPath = isDocker
  ? path.join(__dirname, "frontend/dist") // Docker path
  : path.join(__dirname, "../frontend/dist"); // Local path
app.use(express.static(frontendPath));

// Handle React routing, return all requests to React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(frontendPath, "index.html"));
});

// Default route for debugging
app.get("/", (req, res) => {
  res.send("Welcome to the Budget App API");
});

// Error handling for unmatched routes (if React is not served)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
