import OpenAI from "openai";
import { chatbotInstructions } from "./chatbotInstructions";
import axios from "axios";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});
const token = localStorage.getItem("token");

const response = await axios.get("/api/users/profile", {
  headers: { Authorization: `Bearer ${token}` },
});

const budget = await axios.get("/api/user-categories", {
  headers: { Authorization: `Bearer ${token}` },
});

const data = response.data;
const initialProfile = {
  firstName: data.first_name,
  lastName: data.last_name,
  email: data.email,
  phone: data.phone_number,
  language: data.language,
  currency: data.currency,
};
const profileString = JSON.stringify(initialProfile);
const budgetString = JSON.stringify(budget.data);
console.log(budgetString);

export const streamCompletion = async (
  prompt: string,
  onToken: (token: string) => void,
  signal?: AbortSignal
) => {
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
