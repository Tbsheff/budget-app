import React, { createContext, useContext, useState, useEffect } from "react";

// Define the shape of the user object
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  language: string;
  currency: string;
}

// Define the context type
interface UserContextType {
  user: User | null;
  setUser: (newUser: User | null | ((prevUser: User | null) => User | null)) => void;
  logout: () => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

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

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return <UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>;
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
