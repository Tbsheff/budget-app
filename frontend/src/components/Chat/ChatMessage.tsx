import React from "react";
import { Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  timestamp: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  isStreaming,
  timestamp,
}) => {
  return (
    <div
      className={`flex items-end gap-3 ${
        role === "user" ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {role === "user" ? (
        <div className="user-avatar hidden sm:block" />
      ) : (
        <div className="assistant-avatar hidden sm:flex">
          <Bot className="w-6 h-6" />
        </div>
      )}
      <div
        className={`group relative max-w-[85%] sm:max-w-[80%] ${
          role === "user" ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-3xl px-4 py-3 sm:px-5 sm:py-4 ${
            role === "user"
              ? "bg-purple-600 text-white rounded-br-md"
              : "bg-purple-100 shadow-lg rounded-bl-md"
          } ${isStreaming ? "animate-pulse" : ""}`}
        >
          <ReactMarkdown
            className={`prose prose-sm sm:prose-base max-w-none break-words
              ${
                role === "user"
                  ? "prose-invert"
                  : "prose-purple prose-p:my-1 prose-pre:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5"
              }
              prose-headings:mb-2 prose-headings:mt-4 first:prose-headings:mt-1
              prose-p:mb-2 last:prose-p:mb-1
              prose-pre:bg-purple-50 prose-pre:p-3 prose-pre:rounded-lg
              prose-code:bg-purple-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-ul:pl-2 prose-ol:pl-2
              prose-li:pl-1
              prose-blockquote:border-purple-300 prose-blockquote:bg-purple-50/50
              prose-blockquote:py-0.5 prose-blockquote:px-3 prose-blockquote:my-2
              prose-hr:my-4
              `}
          >
            {content || " "}
          </ReactMarkdown>
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-gray-400 animate-pulse" />
          )}
        </div>
        <div
          className={`message-time mt-1.5 text-[10px] sm:text-xs text-gray-500 ${
            role === "user" ? "text-right" : "text-left"
          }`}
        >
          {timestamp}
        </div>
      </div>
    </div>
  );
};
