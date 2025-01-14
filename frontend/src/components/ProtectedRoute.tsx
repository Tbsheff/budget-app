import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Example: Replace this with your actual authentication logic
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token; // Return true if a token exists
};

const ProtectedRoute: React.FC = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
