import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ChatbotProvider } from "./context/ChatbotContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ChatbotProvider>
    <App />
  </ChatbotProvider>
);
