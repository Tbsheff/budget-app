import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { UserProvider, useUser } from "./context/userContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Dashboard from "./pages/Dashboard";
import { ChatButton } from "./components/Chat/ChatButton";
import { ChatPopup } from "./components/Chat/ChatPopup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <UserProvider>
          <AppRoutes />
        </UserProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const AppRoutes = () => {
  const { user } = useUser();
  const location = useLocation();

  // Define the routes where the chat components should be shown
  const chatRoutes = ["/dashboard", "/income/add", "/expenses/add"];

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        {/* <Route element={<ProtectedRoute />}> */}
        <Route path="/income/add" element={<Income />} />
        <Route path="/income/edit/:id" element={<Income />} />
        <Route path="/expenses/add" element={<Expense />} />
        <Route path="/expenses/edit/:id" element={<Expense />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* </Route> */}
      </Routes>

      {user && chatRoutes.includes(location.pathname) && (
        <>
          <ChatButton />
          <ChatPopup />
        </>
      )}
    </>
  );
};

export default App;
