import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Define the shape of the user object
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  language: string;
  currency: string;
  survey_completed: boolean;
}

// Define the context type
interface UserContextType {
  user: User | null;
  setUser: (newUser: User | null | ((prevUser: User | null) => User | null)) => void;
  logout: () => void;
  checkSurveyStatus: () => Promise<void>;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Helper functions for token management
const saveToken = (token: string) => localStorage.setItem("token", token);
const getToken = () => localStorage.getItem("token");
const clearToken = () => localStorage.removeItem("token");

// Provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(() => {
    // Initialize state from localStorage (if available)
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Set user data manually or through login/updates
  const setUser = (newUser: User | null | ((prevUser: User | null) => User | null)) => {
    if (typeof newUser === "function") {
      setUserState((prevUser) => {
        const updatedUser = newUser(prevUser);
        if (updatedUser) {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } else {
          localStorage.removeItem("user");
        }
        return updatedUser;
      });
    } else {
      if (newUser) {
        localStorage.setItem("user", JSON.stringify(newUser));
      } else {
        localStorage.removeItem("user");
      }
      setUserState(newUser);
    }
  };

  // Check survey status by calling the backend API (if needed after login)
  const checkSurveyStatus = async () => {
    if (!user) return;

    try {
      const token = getToken();
      if (!token) return;

      const response = await axios.get(`/api/users/${user.id}/survey-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update user context based on backend survey status
      if (response.data.survey_completed !== user.survey_completed) {
        setUser((prevUser) =>
          prevUser ? { ...prevUser, survey_completed: response.data.survey_completed } : null
        );
      }
    } catch (error) {
      console.error("Failed to fetch survey status:", error);
    }
  };

  // Logout logic
  const logout = () => {
    setUser(null);
    clearToken(); // Clear the token on logout
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, checkSurveyStatus }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
