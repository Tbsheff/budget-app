import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Loader2, Pause, Bot } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { streamCompletion } from '../../lib/openai';
import { generateDefaultBudget, formatCurrency, saveBudgetToDatabase, type BudgetPlan } from '../../lib/budget';
import { supabase } from '../../lib/supabase';

export const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const { messages, isLoading, addMessage, updateLastMessage, setLoading } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleBudgetRequest = async (income: number) => {
    const budget = generateDefaultBudget(income);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      try {
        await saveBudgetToDatabase(user.id, budget);
        console.log('Budget saved successfully');
      } catch (error) {
        console.error('Error saving budget:', error);
      }
    }

    let response = `Here's your personalized monthly budget plan based on an income of ${formatCurrency(income)}:\n\n`;

    budget.categories.forEach((category) => {
      response += `## ${category.name} (${category.percentage}% - ${formatCurrency(category.amount)})\n\n`;
      category.subcategories?.forEach((sub) => {
        response += `- ${sub.name}: ${formatCurrency(sub.amount)} (${sub.percentage}%)\n`;
      });
      response += '\n';
    });

    response += '\nYou can customize this budget by:\n';
    response += '1. Adjusting category percentages\n';
    response += '2. Adding new categories\n';
    response += '3. Removing existing categories\n';
    response += '4. Saving your modifications\n\n';
    response += 'Would you like to make any adjustments to this budget plan?';

    return response;
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    addMessage({ role: 'user', content: userMessage });
    setLoading(true);
    setIsStreaming(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    addMessage({ role: 'assistant', content: '', isStreaming: true });
    let assistantResponse = '';

    const incomeMatch = userMessage.match(/budget.*?(\d+)k?/i);
    if (incomeMatch) {
      const income = parseInt(incomeMatch[1]) * (userMessage.toLowerCase().includes('k') ? 1000 : 1);
      assistantResponse = await handleBudgetRequest(income);
      updateLastMessage(assistantResponse);
    } else {
      abortControllerRef.current = new AbortController();
      try {
        await streamCompletion(userMessage, (token) => {
          assistantResponse += token;
          updateLastMessage(assistantResponse);
        }, abortControllerRef.current.signal);
      } catch (error) {
        if (error.name === 'AbortError') {
          updateLastMessage(assistantResponse + '\n\n*Message streaming was stopped*');
        } else {
          throw error;
        }
      }
    }

    setLoading(false);
    setIsStreaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex items-end gap-2 ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {message.role === 'user' ? (
              <div className="user-avatar hidden sm:block" />
            ) : (
              <div className="assistant-avatar hidden sm:flex">
                <Bot className="w-5 h-5" />
              </div>
            )}
            <div className={`group relative max-w-[85%] sm:max-w-[80%] ${
              message.role === 'user' ? 'items-end' : 'items-start'
            }`}>
              <div
                className={`rounded-2xl p-3 sm:p-4 ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-100 shadow-lg'
                } ${message.isStreaming && isStreaming ? 'animate-pulse' : ''}`}
              >
                <ReactMarkdown className="prose prose-sm sm:prose-base max-w-none dark:prose-invert break-words">
                  {message.content || ' '}
                </ReactMarkdown>
                {message.isStreaming && isStreaming && index === messages.length - 1 && (
                  <span className="inline-block w-2 h-4 ml-1 bg-gray-400 animate-pulse" />
                )}
              </div>
              <div className={`message-time mt-1 text-[10px] sm:text-xs ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}>
                {formatTime()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 bg-white p-2 sm:p-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto flex items-end gap-2"
        >
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className={`w-full py-2 px-3 sm:p-3 text-sm sm:text-base rounded-2xl border-2 
                border-purple-300/20 bg-white resize-none overflow-hidden
                focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                ${isLoading ? 'bg-gray-100' : ''}`}
              disabled={isLoading}
              rows={1}
              style={{ minHeight: '44px', maxHeight: '150px' }}
            />
            <div className="absolute right-3 bottom-2 text-xs text-gray-400 select-none">
              ⏎ to send
            </div>
          </div>
          <button
            type="button"
            onClick={isStreaming ? stopStreaming : handleSubmit}
            disabled={!isStreaming && (isLoading || !input.trim())}
            className="p-2 sm:p-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 
              disabled:opacity-50 disabled:hover:bg-purple-600 transition-colors duration-200
              flex-shrink-0"
          >
            {isLoading ? (
              isStreaming ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              )
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};