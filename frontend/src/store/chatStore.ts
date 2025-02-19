import { create } from "zustand";

interface QuickstartOption {
  id: string;
  text: string;
  next?: QuickstartOption[];
}

interface CurrentFlow {
  type: string;
  name?: string;
  targetAmount?: number;
  deadline?: string;
  initialDeposit?: number;
  category?: string;
}

interface ChatState {
  messages: Array<{
    id?: string;
    role: "user" | "assistant";
    content: string;
    isStreaming?: boolean;
  }>;
  isOpen: boolean;
  isLoading: boolean;
  isFullscreen: boolean;
  quickstartOptions: QuickstartOption[];
  currentFlow: CurrentFlow | null;
  setQuickstartOptions: (options: QuickstartOption[]) => void;
  setCurrentFlow: (flow: CurrentFlow | null) => void;
  toggleFullscreen: () => void;
  toggleChat: () => void;
  setLoading: (loading: boolean) => void;
  addMessage: (message: {
    role: "user" | "assistant";
    content: string;
    isStreaming?: boolean;
  }) => void;
  updateLastMessage: (content: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isOpen: false,
  isLoading: false,
  isFullscreen: false,
  quickstartOptions: [],
  currentFlow: null,
  setQuickstartOptions: (options) => set({ quickstartOptions: options }),
  setCurrentFlow: (flow) => set({ currentFlow: flow }),
  toggleFullscreen: () =>
    set((state) => ({ isFullscreen: !state.isFullscreen })),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  setLoading: (loading) => set({ isLoading: loading }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, { ...message, id: crypto.randomUUID() }],
    })),
  updateLastMessage: (content) =>
    set((state) => ({
      messages: state.messages.map((msg, idx) =>
        idx === state.messages.length - 1 ? { ...msg, content } : msg
      ),
    })),
}));
