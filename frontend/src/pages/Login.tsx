import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navigation from "../components/landing/Navigation";
import { useUser } from "../context/userContext"; // Import the UserContext
import { supabase } from "@/config/supabaseClient"; // Import supabase client
import { useToast } from "@/hooks/use-toast"; // Import useToast hook

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser(); // Access the setUser function from context
  const { toast } = useToast(); // Access the toast function

  const apiBaseUrl =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000"
      : import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiBaseUrl}/api/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      // Save token in localStorage
      localStorage.setItem("token", token);

      // Update the global user context
      setUser({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        survey_completed: user.survey_completed,
        phone_number: user.phone_number || null,
        language: user.language || "English",
        currency: user.currency || "USD",
      });

      // Check if MFA is enabled
      const { data: mfaData, error: mfaError } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (mfaError) throw mfaError;

      if (mfaData.currentLevel === "aal2") {
        // Navigate to TOTP verification page
        navigate("/mfa/totp-verify", { state: { from: location.pathname } });
      } else {
        // Redirect based on survey completion
        if (user.survey_completed) {
          navigate("/budget");
        } else {
          navigate("/survey");
        }
      }
    } catch (error) {
      console.log(error.message);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: `Login failed: ${error.message}. Please check your credentials and try again.`,
      });
    }
  };

  return (
    <>
      <Navigation />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
          <h2 className="text-2xl font-bold text-center">Log In</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 font-medium text-white bg-primary rounded hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Log In
              </button>
            </div>
          </form>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
