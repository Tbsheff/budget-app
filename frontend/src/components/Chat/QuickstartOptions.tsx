import React from "react";
import { Bot, DollarSign, PiggyBank, TrendingUp } from "lucide-react";

interface QuickstartOptionsProps {
  onOptionSelect: (prompt: string) => void;
}

export const QuickstartOptions: React.FC<QuickstartOptionsProps> = ({
  onOptionSelect,
}) => {
  return (
    <div className="flex flex-col items-center justify-start pt-6 space-y-6 px-4 text-center">
      <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full">
        <Bot className="w-8 h-8 text-purple-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Welcome to Your Financial Assistant
        </h3>
        <p className="text-gray-600 mb-6">
          How can I help you with your financial planning today?
        </p>
      </div>
      <div className="grid gap-3 w-full max-w-sm">
        <button
          onClick={() => onOptionSelect("I need help adjusting my budget")}
          className="flex items-center justify-between px-4 py-3 bg-purple-50 hover:bg-purple-100 
            rounded-lg text-left transition-colors duration-200"
        >
          <span className="flex items-center">
            <DollarSign className="w-5 h-5 text-purple-600 mr-2" />
            <span className="text-gray-700">Adjust My Budget</span>
          </span>
        </button>
        <button
          onClick={() => onOptionSelect("I want to create a savings plan")}
          className="flex items-center justify-between px-4 py-3 bg-purple-50 hover:bg-purple-100 
            rounded-lg text-left transition-colors duration-200"
        >
          <span className="flex items-center">
            <PiggyBank className="w-5 h-5 text-purple-600 mr-2" />
            <span className="text-gray-700">Create a Savings Plan</span>
          </span>
        </button>
        <button
          onClick={() => onOptionSelect("Analyze my spending patterns")}
          className="flex items-center justify-between px-4 py-3 bg-purple-50 hover:bg-purple-100 
            rounded-lg text-left transition-colors duration-200"
        >
          <span className="flex items-center">
            <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
            <span className="text-gray-700">Analyze My Spending</span>
          </span>
        </button>
      </div>
    </div>
  );
};
