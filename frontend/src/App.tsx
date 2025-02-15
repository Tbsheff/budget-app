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
import SpendingPage from "./pages/Spending";
import { ChatButton } from "./components/Chat/ChatButton";
import { ChatPopup } from "./components/Chat/ChatPopup";
import TransactionsPage from "./pages/Transactions";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Survey from "./pages/Survey";
import TranslationWidget from "@/components/Translation";
import SavingsPlan from "./pages/SavingsPlan";

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
  const chatRoutes = ["/dashboard", "/incomes", "/transactions"];

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/survey" element={<Survey />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/spending" element={<SpendingPage />} />
          <Route path="/income" element={<Income />} />
          <Route path="/income/edit/:id" element={<Income />} />
          <Route path="/expenses/edit/:id" element={<Expense />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/savings" element={<SavingsPlan />} />
        </Route>
      </Routes>

      {user && chatRoutes.includes(location.pathname) && (
        <>
          <ChatButton />
          <ChatPopup />
          <TranslationWidget />
        </>
      )}
    </>
  );
};

export default App;
