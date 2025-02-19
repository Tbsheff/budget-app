import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../components/landing/Navigation";

const EmailConfirmation: React.FC = () => {
  return (
    <>
      <Navigation />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
          <h2 className="text-2xl font-bold text-center">Confirm Your Email</h2>
          <p className="text-center text-gray-600">
            A confirmation email has been sent to your email address. Please
            check your inbox and follow the instructions to confirm your email.
          </p>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already confirmed your email?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailConfirmation;
