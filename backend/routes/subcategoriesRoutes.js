const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware"); // Middleware for authentication
const {
  addSubcategory,
  getSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
} = require("../controllers/subcategoriesController");

// Add new subcategory (POST /api/subcategories)
router.post("/", auth, addSubcategory);

// Get all subcategories (GET /api/subcategories)
router.get("/", auth, getSubcategories);

// Get a specific subcategory by ID (GET /api/subcategories/:id)
router.get("/:id", auth, getSubcategoryById);

// Update a subcategory by ID (PUT /api/subcategories/:id)
router.put("/:id", auth, updateSubcategory);

// Delete a subcategory by ID (DELETE /api/subcategories/:id)
router.delete("/:id", auth, deleteSubcategory);

module.exports = router;
