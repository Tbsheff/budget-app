import OpenAI from "openai";
import { chatbotInstructions } from "./chatbotInstructions";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const response = await fetch("http://localhost:5000/api/user/profile", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const profile = await response.data;
console.log(profile);

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
          content: chatbotInstructions,
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
