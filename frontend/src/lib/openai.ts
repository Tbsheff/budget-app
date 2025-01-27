import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const streamCompletion = async (
  prompt: string,
  onToken: (token: string) => void,
  signal?: AbortSignal
) => {
  const stream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a concise financial assistant. Provide brief, direct answers focused on practical financial advice. Keep responses under 3 sentences when possible.'
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 150,
    stream: true,
  }, { signal });

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content || '';
    onToken(token);
  }
};