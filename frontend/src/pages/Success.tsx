import { useState, useEffect } from 'react';
import { SurveyData } from '../types';
import { OpenAI } from 'openai';
import { Loader2 } from 'lucide-react';

interface SuccessPageProps {
  surveyData: SurveyData;
}

interface Budget {
  monthlyBudget: {
    category: string;
    amount: number;
    description: string;
  }[];
  recommendations: string[];
}

export function SuccessPage({ surveyData }: SuccessPageProps) {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateBudget();
  }, []);

  const generateBudget = async () => {
    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const prompt = `Based on the following financial survey data, create a detailed monthly budget and provide financial recommendations:
      
      Monthly Income: $${surveyData.monthlyIncome}
      Additional Income: $${surveyData.additionalIncome || 0}
      Current Expenses:
      - Housing: $${surveyData.housingPayment}
      - Utilities: $${surveyData.utilities}
      - Internet/Phone: $${surveyData.internetAndPhone}
      - Transportation: $${surveyData.transportationCosts}
      - Health Insurance: $${surveyData.healthInsurance}
      - Groceries: $${surveyData.groceries}
      Current Savings: $${surveyData.monthlySavings}
      Desired Monthly Savings: $${surveyData.desiredMonthlySavings}
      Financial Priorities: ${surveyData.financialPriorities.join(', ')}
      
      Please provide:
      1. A detailed monthly budget breakdown with specific amounts for each category
      2. Three specific recommendations for achieving their financial goals
      
      Format the response as JSON with the following structure:
      {
        "monthlyBudget": [
          {
            "category": "string",
            "amount": number,
            "description": "string"
          }
        ],
        "recommendations": ["string"]
      }`;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
        response_format: { type: "json_object" },
      });

      const response = JSON.parse(completion.choices[0].message.content);
      setBudget(response);
      setLoading(false);
    } catch (err) {
      setError('Failed to generate budget. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Generating your personalized budget...</h2>
          <p className="text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

    if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">{error}</h2>
        </div>
      </div>
        );
    }