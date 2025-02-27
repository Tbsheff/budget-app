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
import Budget from "./pages/BudgetDashboard";
import Dashboard from "./pages/Dashboard";
import SpendingPage from "./pages/Spending";
import { ChatButton } from "./components/Chat/ChatButton";
import { ChatPopup } from "./components/Chat/ChatPopup";
import TransactionsPage from "./pages/Transactions";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Survey from "./pages/Survey";
import CategoryAnalytics from "./pages/CategoryAnalytics";
import TranslationWidget from "@/components/Translation";
import SavingsPlan from "./pages/SavingsPlan";
import EmailConfirmation from "./pages/EmailConfirmation";
import MFASetup from "./pages/MFASetup";
import TOTPSetup from "./pages/TOTPSetup";
import TOTPVerify from "./pages/TOTPVerify";
import ManageMFA from "./pages/ManageMFA";

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
  const chatRoutes = [
    "/budget",
    "/income",
    "/transactions",
    "/spending",
    "/profile",
    "/category/analytics/:categoryId",
    "/",
    "/dashboard",
  ];

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email-confirmation" element={<EmailConfirmation />} />
        <Route path="/mfa/totp-verify" element={<TOTPVerify />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/survey" element={<Survey />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/budget" element={<Budget />} />
          <Route
            path="/category/analytics/:categoryId"
            element={<CategoryAnalytics />}
          />
          <Route path="/spending" element={<SpendingPage />} />
          <Route path="/income" element={<Income />} />
          <Route path="/income/edit/:id" element={<Income />} />
          <Route path="/expenses/edit/:id" element={<Expense />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/savings" element={<SavingsPlan />} />
          <Route path="/mfa-setup" element={<MFASetup />} />
          <Route path="/mfa/totp-setup" element={<TOTPSetup />} />
          <Route path="/mfa/manage" element={<MFASetup />} />
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
