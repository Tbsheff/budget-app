const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const Default_categories = require("../models/default_categories");
const User_categories = require("../models/user_categories");
const Budget_groups = require("../models/budget_groups"); // Correct reference
const User_budget_groups = require("../models/user_budget_groups");

exports.registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // Validate input
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password_hash: hashedPassword,
      phone_number: null,
      language: "English",
      currency: "USD",
      survey_completed: false,
    });

    // Fetch default budget groups
    const defaultBudgetGroups = await Budget_groups.findAll();

    // Create user-specific budget groups
    const userBudgetGroups = await Promise.all(
      defaultBudgetGroups.map(async (group) => {
        return await User_budget_groups.create({
          user_id: newUser.user_id,
          default_category_id: group.id, // Correct mapping
          group_name: group.group_name,
        });
      })
    );

    // Create a map to relate default budget groups to the new user-specific ones
    const budgetGroupMap = {};
    userBudgetGroups.forEach((userGroup) => {
      budgetGroupMap[userGroup.default_category_id] = userGroup.budget_group_id;
    });
    

    // Fetch default categories
    const defaultCategories = await Default_categories.findAll();

    // Map default categories to user categories, ensuring correct budget group reference
    const userCategories = defaultCategories.map((category) => ({
      user_id: newUser.user_id,
      default_category_id: category.default_category_id,
      name: category.name,
      monthly_budget: category.default_budget || 0,
      icon_name: category.icon_name,
      icon_color: category.icon_color,
      budget_group_id: budgetGroupMap[category.budget_group_id] || null,
    }));
    

    // Bulk insert user categories
    await User_categories.bulkCreate(userCategories);

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.user_id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        language: newUser.language,
        currency: newUser.currency,
        survey_completed: newUser.survey_completed,
      },
    });
  } catch (err) {
    console.error("Error during registration:", err.message);
    return res.status(500).json({
      message: "An unexpected error occurred during registration.",
    });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Sign JWT
    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Include survey_completed in the response
    return res.status(200).json({
      token,
      user: {
        id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        survey_completed: user.survey_completed, // Map this properly
      },
    });
  } catch (err) {
    console.error("Error during login:", err.message);
    return res.status(500).json({ message: "An unexpected error occurred during login." });
  }
};
