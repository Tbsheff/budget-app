const { sequelize } = require("../config/db");

exports.executeQuery = async (req, res) => {
  try {
    const { sql_query, parameters } = req.body;
    const user_id = req.user.id; // Assuming the user is attached to the request object by the authentication middleware

    console.log("Executing SQL Query:", sql_query);
    console.log("With Parameters:", parameters);

    // Ensure the query is a SELECT statement for safety
    if (!sql_query.toLowerCase().trim().startsWith("select")) {
      return res.status(400).json({ message: "Only SELECT queries are allowed." });
    }

    // Add user_id to the parameters if it's not already included
    const updatedParameters = [...parameters, user_id];

    // Execute the query using Sequelize
    const [results] = await sequelize.query(sql_query, {
      replacements: updatedParameters,
    });

    console.log("Query Results:", results);
    res.json(results);
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res.status(500).json({ message: "Failed to execute query", error: error.message });
  }
};