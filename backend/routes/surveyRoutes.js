const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");  // Authentication middleware
const {
  saveSurvey,
  getSurvey,
  updateSurvey,
  deleteSurvey,
} = require("../controllers/surveyController");

// POST /api/surveys - Save a new survey
router.post("/", auth, saveSurvey);

// GET /api/surveys/:survey_id - Retrieve a survey
router.get("/:survey_id", auth, getSurvey);

// PUT /api/surveys/:survey_id - Update a survey
router.put("/:survey_id", auth, updateSurvey);

// DELETE /api/surveys/:survey_id - Delete a survey
router.delete("/:survey_id", auth, deleteSurvey);

module.exports = router;
