const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path"); // Import path module
require("dotenv").config();

const sequelize = require("./config/db"); // Import the Sequelize instance

const app = express();

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
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/incomes", require("./routes/incomeRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/goals", require("./routes/goalRoutes"));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Handle React routing, return all requests to React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
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
