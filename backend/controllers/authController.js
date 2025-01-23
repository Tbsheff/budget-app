const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const Default_categories = require("../models/default_categories");
const User_categories = require("../models/user_categories");

// Register User
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
    });

    // Fetch default categories
    const defaultCategories = await Default_categories.findAll();

    // Map default categories to user categories
    const userCategories = defaultCategories.map((category) => ({
      user_id: newUser.user_id, // Associate with the newly created user
      default_category_id: category.category_id,
      name: category.name,
      monthly_budget: category.default_budget || 0, // Use default budget if available
    }));

    // Bulk insert user categories
    await User_categories.bulkCreate(userCategories);

    return res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error("Error during registration:", err.message);
    return res.status(500).json({ message: "An unexpected error occurred during registration." });
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

    return res.status(200).json({
      token,
      user: {
        id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error during login:", err.message);
    return res.status(500).json({ message: "An unexpected error occurred during login." });
  }
};
