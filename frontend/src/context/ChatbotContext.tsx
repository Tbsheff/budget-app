import { createContext, useContext, useState, ReactNode } from "react";

interface Message {
  role: "user" | "bot";
  text: string;
}

interface ChatbotContextType {
  messages: Message[];
  addMessage: (role: "user" | "bot", text: string) => void;
  clearChat: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | null>(null);

// Custom hook for easy access
export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
};

// Provider Component
export const ChatbotProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (role: "user" | "bot", text: string) => {
    setMessages((prev) => [...prev, { role, text }]);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <ChatbotContext.Provider value={{ messages, addMessage, clearChat }}>
      {children}
    </ChatbotContext.Provider>
  );
};