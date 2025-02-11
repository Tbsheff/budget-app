import React from 'react';
import { Chat } from './Chat';
import { useChatStore } from '../../store/chatStore';
import { X } from 'lucide-react';

export const ChatPopup: React.FC = () => {
  const { isOpen, toggleChat } = useChatStore();

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 sm:p-0 touch-none">
      <div 
        className="fixed inset-0 sm:hidden bg-black/20 backdrop-blur-sm"
        onClick={toggleChat}
      />
      <div className="relative w-[calc(100vw-2rem)] h-[calc(100vh-5rem)] 
        sm:w-[400px] sm:h-[600px] 
        rounded-2xl shadow-2xl bg-white overflow-hidden
        transform transition-all duration-300 ease-in-out
        animate-in slide-in-from-bottom-8">
        <div className="flex items-center justify-between bg-gradient-to-r from-purple-600 to-purple-800 px-4 py-3">
          <h2 className="text-lg font-semibold text-white">Financial Assistant</h2>
          <button
            onClick={toggleChat}
            className="p-1 rounded-full hover:bg-white/10 transition-colors duration-200
              active:scale-95 touch-manipulation"
            aria-label="Close chat"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden h-[calc(100%-3.5rem)]">
          <Chat />
        </div>
      </div>
    </div>
  );
};