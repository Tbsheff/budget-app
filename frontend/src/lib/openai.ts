import OpenAI from "openai";
import { chatbotEgo } from "../store/ChatbotEgo"; // Import chatbot settings

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const streamCompletion = async (
  prompt: string,
  onToken: (token: string) => void,
  signal?: AbortSignal
) => {
  const systemMessage =
    chatbotEgo.introduction + chatbotEgo.capabilities + chatbotEgo.behavior;

  const stream = await openai.chat.completions.create(
    {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
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
