import OpenAI from "openai";
import { chatbotInstructions } from "./chatbotInstructions";
import axios from "axios";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const fetchProfileAndBudget = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("No token found. Skipping profile and budget fetch.");
    return { profileString: "", budgetString: "" };
  }

  try {
    const response = await axios.get("/api/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const budget = await axios.get("/api/user-categories", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const initialProfile = {
      firstName: response.data.first_name,
      lastName: response.data.last_name,
      email: response.data.email,
      phone: response.data.phone_number,
      language: response.data.language,
      currency: response.data.currency,
    };

    const profileString = JSON.stringify(initialProfile);
    const budgetString = JSON.stringify(budget.data);

    return { profileString, budgetString };
  } catch (error) {
    console.error("Error fetching profile or budget:", error);
    return { profileString: "", budgetString: "" };
  }
};

export const streamCompletion = async (
  prompt: string,
  onToken: (token: string) => void,
  signal?: AbortSignal
) => {
  const { profileString, budgetString } = await fetchProfileAndBudget();

  const stream = await openai.chat.completions.create(
    {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `${chatbotInstructions} ${profileString} ${budgetString}`,
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 150,
      stream: true,
    },
    { signal }
  );

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content || "";
    onToken(token);
  }
};
