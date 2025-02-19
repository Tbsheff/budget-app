const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const Default_categories = require("../models/default_categories");
const User_categories = require("../models/user_categories");
const Budget_groups = require("../models/budget_groups"); // Correct reference
const User_budget_groups = require("../models/user_budget_groups");
const { supabase } = require("../config/supabaseClient"); // Import Supabase instance

exports.registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, supabase_id } = req.body;

    // Log the request payload
    console.log("Request payload:", req.body);

    // Validate input
    if (!first_name || !last_name || !email || !password || !supabase_id) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Create user in your database
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      supabase_id, // Store Supabase UID
      phone_number: null,
      language: "English",
      currency: "USD",
      survey_completed: false,
    });

    // Sign JWT
    const token = jwt.sign({ id: newUser.user_id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(201).json({
      message: "User created successfully",
      token,
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

    // Login user with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const supabaseUser = data.user;

    // Find user in your database
    const user = await User.findOne({ where: { email } });
    if (!user) {
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
        survey_completed: user.survey_completed,
      },
    });
  } catch (err) {
    console.error("Error during login:", err.message);
    return res.status(500).json({ message: "An unexpected error occurred during login." });
  }
};
