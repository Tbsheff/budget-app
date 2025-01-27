import { create } from 'zustand';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  isOpen: boolean;
  addMessage: (message: Omit<Message, 'id'>) => void;
  updateLastMessage: (content: string) => void;
  setLoading: (loading: boolean) => void;
  toggleChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,
  isOpen: false,
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, { ...message, id: crypto.randomUUID() }],
    })),
  updateLastMessage: (content) =>
    set((state) => ({
      messages: state.messages.map((msg, index) => {
        if (index === state.messages.length - 1) {
          return { ...msg, content };
        }
        return msg;
      }),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
}));