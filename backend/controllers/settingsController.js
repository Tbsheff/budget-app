const Languages = require("../models/languages");
const Currencies = require("../models/currencies");

// Fetch all available languages
exports.getLanguages = async (req, res) => {
  try {
    const languages = await Languages.findAll({
      attributes: ["name"], // Only fetch language names
    });
    res.status(200).json(languages);
  } catch (error) {
    console.error("Error fetching languages:", error);
    res.status(500).json({ message: "Failed to fetch languages" });
  }
};

// Fetch all available currencies
exports.getCurrencies = async (req, res) => {
  try {
    const currencies = await Currencies.findAll({
      attributes: ["name"], // Fetch only currency names
    });
    res.status(200).json(currencies);
  } catch (error) {
    console.error("Error fetching currencies:", error);
    res.status(500).json({ message: "Failed to fetch currencies" });
  }
};
