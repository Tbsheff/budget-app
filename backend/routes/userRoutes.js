const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { registerUser, loginUser } = require("../controllers/authController");
const { getUserProfile, updateUserProfile } = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);

// GET /api/user/profile - Get user profile data
router.get("/profile", auth, getUserProfile);

// PUT /api/user/profile - Update user profile data
router.put("/profile", auth, updateUserProfile);

module.exports = router;
