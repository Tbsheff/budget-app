const Survey = require("../models/survey");

// Save a new survey
exports.saveSurvey = async (req, res) => {
  try {
    const surveyData = req.body;
    surveyData.user_id = req.user.id;  // Assume user ID comes from authentication middleware

    const newSurvey = await Survey.create(surveyData);
    res.status(201).json({ message: "Survey submitted successfully", survey: newSurvey });
  } catch (error) {
    console.error("Error saving survey:", error);
    res.status(500).json({ message: "Failed to save survey" });
  }
};

// Get a user's survey by survey_id
exports.getSurvey = async (req, res) => {
  try {
    const { survey_id } = req.params;
    const survey = await Survey.findOne({
      where: {
        survey_id,
        user_id: req.user.id,  // Ensuring the survey belongs to the logged-in user
      },
    });

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    res.status(200).json(survey);
  } catch (error) {
    console.error("Error fetching survey:", error);
    res.status(500).json({ message: "Failed to retrieve survey" });
  }
};

// Update an existing survey by survey_id
exports.updateSurvey = async (req, res) => {
  try {
    const { survey_id } = req.params;
    const updated = await Survey.update(req.body, {
      where: {
        survey_id,
        user_id: req.user.id,
      },
    });

    if (updated[0] === 0) {
      return res.status(404).json({ message: "Survey not found or no changes made" });
    }

    res.status(200).json({ message: "Survey updated successfully" });
  } catch (error) {
    console.error("Error updating survey:", error);
    res.status(500).json({ message: "Failed to update survey" });
  }
};

// Delete a survey by survey_id
exports.deleteSurvey = async (req, res) => {
  try {
    const { survey_id } = req.params;

    const deleted = await Survey.destroy({
      where: {
        survey_id,
        user_id: req.user.id,
      },
    });

    if (deleted === 0) {
      return res.status(404).json({ message: "Survey not found" });
    }

    res.status(200).json({ message: "Survey deleted successfully" });
  } catch (error) {
    console.error("Error deleting survey:", error);
    res.status(500).json({ message: "Failed to delete survey" });
  }
};
