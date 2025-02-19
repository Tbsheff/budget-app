import { streamCompletion } from "./openai";

interface SQLQueryResult {
  sql_query: string;
  parameters: string[];
}

export const generateSQLQuery = async (
  userInput: string,
  onToken: (token: string) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: any
): Promise<SQLQueryResult | null> => {
  let responseJson = "";

  try {
    await streamCompletion(
      JSON.stringify({
        type: "generate_sql",
        input: userInput,
        schema: schema,
      }),
      (token) => {
        responseJson += token;
        onToken("Generating SQL query...");
      }
    );

    const result = JSON.parse(responseJson);
    if (!result.sql_query) {
      throw new Error("Failed to generate SQL query");
    }

    return result;
  } catch (error) {
    console.error("Error generating SQL query:", error);
    return null;
  }
};

export const executeSQLQuery = async (sqlData: SQLQueryResult) => {
  try {
    // Ensure the query is a SELECT statement for safety
    if (!sqlData.sql_query.toLowerCase().trim().startsWith("select")) {
      throw new Error("Only SELECT queries are allowed for security reasons.");
    }

    // Here you would normally execute the query against your database
    // For now, we'll simulate a response
    const response = await fetch("/api/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sqlData),
    });

    if (!response.ok) {
      throw new Error("Failed to execute query");
    }

    return await response.json();
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw error;
  }
};
