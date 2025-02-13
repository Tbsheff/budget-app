const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getUserCategories,
  getUserCategoryById,
  addUserCategory,
  updateUserCategory,
  deleteUserCategory,
  createUserCategory
} = require("../controllers/userCategoriesController");

// Get all user categories (GET /api/user-categories)
router.get("/", auth, getUserCategories);

// Get a single category by ID (GET /api/user-categories/:id)
router.get("/:id", auth, getUserCategoryById);

// Add a new category (POST /api/user-categories)
router.post("/add", auth, addUserCategory);

// Update a category by ID (PUT /api/user-categories/:id)
router.put("/:id", auth, updateUserCategory);

// Delete a category by ID (DELETE /api/user-categories/:id)
router.delete("/:id", auth, deleteUserCategory);

// Create a new category (POST /api/user-categories/create)
router.post("/create", auth, createUserCategory);

module.exports = router;
