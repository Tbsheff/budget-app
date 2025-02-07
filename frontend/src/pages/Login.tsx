import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navigation from "../components/landing/Navigation";
import { useUser } from "../context/userContext"; // Import the UserContext

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser(); // Access the setUser function from context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // Save token in localStorage
      localStorage.setItem("token", response.data.token);

      // Update the global user context
      setUser({
        id: response.data.user.id,
        first_name: response.data.user.first_name,
        last_name: response.data.user.last_name,
        email: response.data.user.email,
        survey_completed: response.data.user.survey_completed,
        phone_number: response.data.user.phone_number || null,
        language: response.data.user.language || "English",
        currency: response.data.user.currency || "USD",
      });

      // Redirect based on survey completion
      // if (response.data.user.survey_completed) {
      //   console.log("Survey already completed. Redirecting to dashboard.");
      //   navigate("/dashboard");
      // } else {
      //   console.log("Survey not completed. Redirecting to survey.");
      //   navigate("/survey");
      // }
    } catch (error) {
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <>
      <Navigation />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
          <h2 className="text-2xl font-bold text-center">Log In</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
