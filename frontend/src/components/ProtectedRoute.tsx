import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/userContext";

const ProtectedRoute: React.FC = () => {
  const { user } = useUser();

  if (!user) {
    // Redirect to login if the user is not authenticated
    return <Navigate to="/login" replace />;
  }

  // if (user.survey_completed) {
  //   console.log("Redirecting to dashboard");
  //   return <Navigate to="/dashboard" replace />;
  // }

  return <Outlet />; // Render nested routes (like Dashboard, Profile, etc.)
};

export default ProtectedRoute;
