import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/landing/Navigation";
import axios from "axios";
import { useToast } from "../components/ui/use-toast";
import { supabase } from "../config/supabaseClient"; // Import Supabase instance

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const { toast, dismiss } = useToast();

  const apiBaseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000"
      : import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    return () => {
      dismiss(); // Dismiss all active toasts when component unmounts
    };
  }, [dismiss]);

  const validatePassword = (password: string) => {
    const lengthCheck = password.length >= 12;
    const uppercaseCheck = /[A-Z]/.test(password);
    const lowercaseCheck = /[a-z]/.test(password);
    const numberCheck = /[0-9]/.test(password);
    const specialCharCheck = (password.match(/[!@#$%^&*]/g) || []).length >= 2;

    if (
      !lengthCheck ||
      !uppercaseCheck ||
      !lowercaseCheck ||
      !numberCheck ||
      !specialCharCheck
    ) {
      return "Password must contain at least 12 characters, including uppercase, lowercase, a number, and two special characters.";
    }
    return "";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (passwordError) {
      setError("Please fix password requirements before submitting.");
      toast({
        variant: "destructive",
        title: "Invalid Password",
        description:
          "Please ensure your password meets the security requirements.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "The passwords entered do not match. Please try again.",
      });
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
      });
      return;
    }

    try {
      await axios.post(`${apiBaseUrl}/api/auth/register`, {
        first_name: firstName,
        last_name: lastName,
        email,
        password, // Ensure password is included in the request payload
        supabase_id: data.user?.id, // Store UID instead of handling passwords
      });

      toast({
        variant: "default",
        title: "Registration Successful",
        description:
          "Your account has been created. Redirecting to email confirmation...",
      });

      setTimeout(() => {
        navigate("/email-confirmation");
      }, 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: err.response?.data?.message || "Error registering user",
      });
    }
  };

  return (
    <>
      <Navigation />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
          <h2 className="text-2xl font-bold text-center">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-500">{passwordError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <p className="mt-1 text-xs italic text-gray-500">
              *Passwords must contain at least 12 characters, including
              uppercase, lowercase, a number, and two special characters
            </p>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 font-medium text-white bg-primary rounded hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
