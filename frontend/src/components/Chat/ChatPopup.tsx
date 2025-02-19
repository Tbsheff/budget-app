import React from "react";
import { Chat } from "./Chat";
import { useChatStore } from "../../store/chatStore";
import { X, Maximize2, Minimize2 } from "lucide-react";

export const ChatPopup: React.FC = () => {
  const { isOpen, isFullscreen, toggleChat, toggleFullscreen } = useChatStore();

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-40 touch-none transition-all duration-300 ease-in-out
      ${isFullscreen ? "inset-0" : "bottom-6 right-6 sm:p-0"}`}
    >
      <div
        className={`fixed inset-0 ${isFullscreen ? "" : "sm:hidden"} bg-black/20 backdrop-blur-sm`}
        onClick={toggleChat}
      />
      <div
        className={`relative bg-white flex flex-col overflow-hidden
        transform transition-all duration-300 ease-in-out
        animate-in slide-in-from-bottom-8
        ${
          isFullscreen
            ? "w-full h-full rounded-none"
            : "w-[calc(100vw-2rem)] h-[calc(100vh-5rem)] sm:w-[400px] sm:h-[600px] rounded-2xl shadow-2xl"
        }`}
      >
        <div
          className={`flex items-center justify-between bg-gradient-to-r from-purple-600 to-purple-800 px-4 py-3 flex-none
          ${isFullscreen ? "" : "rounded-t-2xl"}`}
        >
          <h2 className="text-lg font-semibold text-white">
            Financial Assistant
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-1 rounded-full hover:bg-white/10 transition-colors duration-200
                active:scale-95 touch-manipulation"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5 text-white" />
              ) : (
                <Maximize2 className="w-5 h-5 text-white" />
              )}
            </button>
            <button
              onClick={toggleChat}
              className="p-1 rounded-full hover:bg-white/10 transition-colors duration-200
                active:scale-95 touch-manipulation"
              aria-label="Close chat"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          <Chat />
        </div>
      </div>
    </div>
  );
};
