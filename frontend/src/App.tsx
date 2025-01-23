import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import { DashboardPage } from "./pages/Dashboard";
import Account from "./pages/Account";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
          {/* Protected Routes */}
          {/* <Route element={<ProtectedRoute />}> */}
          <Route path="/income/add" element={<Income />} />
          <Route path="/income/edit/:id" element={<Income />} />
          <Route path="/expenses/add" element={<Expense />} />
          <Route path="/expenses/edit/:id" element={<Expense />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
