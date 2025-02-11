const User = require("../models/users");

// Fetch user profile data
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { user_id: req.user.id },
      attributes: ["first_name", "last_name", "email", "phone_number", "language", "currency"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

// Update user profile data
exports.updateUserProfile = async (req, res) => {
  try {
    const { first_name, last_name, email, phone_number, language, currency } = req.body;

    const updated = await User.update(
      {
        first_name,
        last_name,
        email,
        phone_number,
        language,
        currency,
      },
      {
        where: { user_id: req.user.id },
      }
    );

    if (updated[0] === 0) {
      return res.status(404).json({ message: "No changes detected or user not found" });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update user profile" });
  }
};
