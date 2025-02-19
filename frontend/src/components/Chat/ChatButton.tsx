import React from "react";
import { MessageCircle } from "lucide-react";
import { useChatStore } from "../../store/chatStore";

export const ChatButton: React.FC = () => {
  const { isOpen, toggleChat } = useChatStore();

  // Don't render the button when the chat is open
  if (isOpen) return null;

  return (
    <button
      onClick={toggleChat}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-purple-600 text-white 
        shadow-lg hover:bg-purple-700 transition-all duration-200 ease-in-out
        hover:scale-105 active:scale-95 flex items-center justify-center"
      aria-label="Open chat"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
};
