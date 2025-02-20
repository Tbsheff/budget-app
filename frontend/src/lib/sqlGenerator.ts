import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Allow running in browser (CAUTION: Only use in trusted environments)
});

interface SQLQueryResult {
  sql_query: string;
  parameters: string[];
}

export const generateSQLQuery = async (
  userInput: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: any
): Promise<SQLQueryResult | null> => {
  try {
    console.log("Starting SQL query generation...");
    console.log("User Input:", userInput);
    console.log("Schema:", schema);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful SQL assistant. Based on the given schema, generate an SQL query in structured JSON format.`,
        },
        {
          role: "user",
          content: `Generate an SQL query based on the following schema and user input. Only use columns from the provided schema. Do not use any aliases or other columns.:
            If the user asks about how much they have spent, query the transactions table for the given category and sum their expenses. 
          Schema:
          ${JSON.stringify(schema, null, 2)}

          User Input:
          ${userInput}
          
          **Requirements**:
1. Use parameterized queries (\`?\`) to prevent SQL injection.
2. Extract and return the actual parameter values in an array.
3. **Return JSON** with keys:
   - **"sql_query"**: The SQL query.
   - **"parameters"**: An array of values extracted from user input.
4. **Do not** include any sensitive information in the response.
5. Join tables if you do not have the necessary keys. For example, if the user asks for the total amount spent in a category, you may need to join the transactions table with the categories table.
6. **Do not** include any aliases or other columns in the query.
7. Return the result as JSON with keys "sql_query" and "parameters". If parameters are used, list them in "parameters". Never return a user_id in parameters. If a user_id is needed, return an empty array in parameters. 

Example JSON response:
{
  "sql_query": "SELECT SUM(amount) FROM transactions WHERE user_id = ? AND category_id = ? AND transaction_date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)",
  "parameters": [123, 5]
}

`,
        },
      ],
      temperature: 0.2,
      max_tokens: 200,
    });

    console.log("Raw API Response:", JSON.stringify(response, null, 2));

    if (!response.choices || response.choices.length === 0) {
      throw new Error("No SQL query was generated.");
    }

    // Extract the JSON content from the API response
    const rawContent = response.choices[0].message.content;
    const jsonContent = rawContent.replace(/```json|```/g, "").trim();
    const sqlResponse = JSON.parse(jsonContent);

    console.log("Generated SQL Query:", sqlResponse.sql_query);
    console.log("Query Parameters:", sqlResponse.parameters);

    return sqlResponse as SQLQueryResult;
  } catch (error) {
    console.error("Error generating SQL query:", error);
    return null;
  }
};

export const executeSQLQuery = async (sqlData: SQLQueryResult) => {
  try {
    console.log("Executing SQL query...");
    console.log("SQL Query:", sqlData.sql_query);
    console.log("Parameters:", sqlData.parameters);

    // Ensure the query is a SELECT statement for safety
    if (!sqlData.sql_query.toLowerCase().trim().startsWith("select")) {
      throw new Error("Only SELECT queries are allowed for security reasons.");
    }

    // Execute the query against your database
    const response = await fetch("/api/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(sqlData),
    });

    if (!response.ok) {
      throw new Error("Failed to execute query");
    }

    const result = await response.json();
    console.log("Query Result:", result);
    return result;
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw error;
  }
};
