import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const loadingMessages = [
  "Analyzing your financial data...",
  "Building your personalized budget...",
  "Calculating optimal savings strategies...",
  "Generating financial recommendations...",
  "Creating your financial dashboard...",
];

interface LoadingPageProps {
  onComplete: () => void;
}

export function LoadingPage({ onComplete }: LoadingPageProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
            </div>
            <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto" />
          </div>

          <div className="h-16">
            <p className="text-xl font-medium text-gray-700 transition-opacity duration-500">
              {loadingMessages[messageIndex]}
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-progress"></div>
            </div>
            <p className="text-sm text-gray-500">
              Please wait while we prepare your financial insights
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
