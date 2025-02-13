import React, { useState } from "react";
import axios from "axios";
import { ProgressBar } from "../components/Survey/ProgressBar";
import { NavigationButtons } from "../components/Survey/NavigationButtons";
import { InputField } from "../components/Survey/InputField";
import { MultiSelect } from "../components/Survey/MultiSelect";
import { Select } from "../components/Survey/Select";
import { SurveyData, initialSurveyData } from "../types";
import { useToast } from "../components/ui/use-toast"; // Toast for success/error messages
import { ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import OpenAI from "openai"; // Import OpenAI

const TOTAL_PAGES = 10;

const EMPLOYMENT_STATUSES = [
  "Full-time employed",
  "Part-time employed",
  "Self-employed",
  "Unemployed",
  "Retired",
  "Student",
  "Other",
];

const FINANCIAL_PRIORITIES = [
  "Building emergency savings",
  "Paying off debt",
  "Saving for retirement",
  "Buying a home",
  "Saving for education",
  "Starting a business",
  "Investment growth",
  "Tax planning",
  "Estate planning",
];

function Survey() {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<SurveyData>(initialSurveyData);
  const [budget, setBudget] = useState(null); // State for budget
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const [error, setError] = useState(""); // State for error
  const { toast } = useToast(); // Toast for success/error messages
  const navigate = useNavigate(); // For redirection after submission
  const { setUser } = useUser();

  // Update field value in form state
  const updateField = (
    field: keyof SurveyData,
    value: string | number | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === "string" && value.trim() === "" ? 0 : value,
    }));
  };

  // Ensure each page is valid before moving to the next
  const isPageValid = () => {
    switch (currentPage) {
      case 1:
        return (
          formData.age > 0 &&
          formData.targetRetirementAge > formData.age &&
          formData.employmentStatus !== ""
        );
      case 2:
        return formData.monthlyIncome > 0;
      case 3:
        return formData.housingPayment >= 0;
      case 4:
        return formData.utilities >= 0 && formData.internetAndPhone >= 0;
      case 5:
        return formData.transportationCosts >= 0;
      case 6:
        return formData.healthInsurance >= 0;
      case 7:
        return formData.groceries >= 0;
      case 8:
        return true;
      case 9:
        return formData.monthlySavings >= 0;
      case 10:
        return (
          formData.financialPriorities.length > 0 &&
          formData.desiredMonthlySavings >= 0 &&
          (formData.financialPriorities.includes("Other")
            ? formData.otherPriority.trim() !== ""
            : true)
        );
      default:
        return false;
    }
  };

  // Submit survey to backend
  const handleSubmitSurvey = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post("/api/survey", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 🔧 Update survey_completed in the user context
      setUser((prevUser) =>
        prevUser ? { ...prevUser, survey_completed: true } : null
      );

      toast({
        title: "Success",
        description: "Survey submitted successfully.",
      });

      navigate("/dashboard"); // Redirect to the dashboard after submission

      // Call generateBudget after successful survey submission
      await generateBudget();
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast({
        title: "Error",
        description: "Failed to submit the survey. Please try again.",
      });
    }
  };

  // Generate budget using OpenAI
  const generateBudget = async () => {
    try {
      setIsLoading(true);
      setError("");

      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const prompt = `Based on the following financial survey data, create a detailed monthly budget and provide financial recommendations:
      
      Monthly Income: $${formData.monthlyIncome}
      Additional Income: $${formData.additionalIncome || 0}
      Current Expenses:
      - Housing: $${formData.housingPayment}
      - Utilities: $${formData.utilities}
      - Internet/Phone: $${formData.internetAndPhone}
      - Transportation: $${formData.transportationCosts}
      - Health Insurance: $${formData.healthInsurance}
      - Groceries: $${formData.groceries}
      Current Savings: $${formData.monthlySavings}
      Desired Monthly Savings: $${formData.desiredMonthlySavings}
      Financial Priorities: ${formData.financialPriorities.join(", ")}
      
      Please provide:
      1. A detailed monthly budget breakdown with specific amounts for each category
      2. Three specific recommendations for achieving their financial goals
      
      Format the response as JSON with the following structure:
      {
        "budgetGroups": [
          {
            "group_name": "string",
            "categories": [
              {
                "name": "string",
                "monthly_budget": number,
                "icon_name": "string",
                "icon_color": "string"
              }
            ]
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

      // Save the budget to the database
      const token = localStorage.getItem("token");
      await axios.post("/api/budget/save", response, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBudget(response);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to generate budget:", err);
      setError("Failed to generate budget. Please try again.");
      setIsLoading(false);
    }
  };

  // Render the corresponding page of the survey
  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <>
            <InputField
              label="What is your age?"
              type="number"
              value={formData.age === 0 ? "" : formData.age} // Avoid showing 0
              onChange={(value) =>
                updateField("age", value === "" ? 0 : Number(value))
              }
              min={18}
              max={100}
              tooltip="Must be at least 18 years old"
            />
            <InputField
              label="What is your target retirement age?"
              type="number"
              value={
                formData.targetRetirementAge === 0
                  ? ""
                  : formData.targetRetirementAge
              }
              onChange={(value) =>
                updateField(
                  "targetRetirementAge",
                  value === "" ? 0 : Number(value)
                )
              }
              min={formData.age}
              max={100}
              tooltip="Must be greater than your current age"
            />
            <Select
              label="What is your current employment status?"
              options={EMPLOYMENT_STATUSES}
              value={formData.employmentStatus}
              onChange={(value) => updateField("employmentStatus", value)}
              tooltip="Select the option that best describes your current employment situation"
            />
          </>
        );
      case 2:
        return (
          <>
            <InputField
              label="What is your monthly take-home income after taxes?"
              type="number"
              value={formData.monthlyIncome === 0 ? "" : formData.monthlyIncome}
              onChange={(value) =>
                updateField("monthlyIncome", value === "" ? 0 : Number(value))
              }
              min={0}
              tooltip="Your net income after all tax deductions"
            />
            <InputField
              label="Do you have any additional sources of income? If yes, how much monthly?"
              type="number"
              value={
                formData.additionalIncome === 0 ? "" : formData.additionalIncome
              }
              onChange={(value) =>
                updateField(
                  "additionalIncome",
                  value === "" ? 0 : Number(value)
                )
              }
              min={0}
              required={false}
              tooltip="Include freelance work, investments, rental income, etc."
            />
          </>
        );
      case 3:
        return (
          <InputField
            label="What is your monthly housing payment (rent/mortgage)?"
            type="number"
            value={formData.housingPayment === 0 ? "" : formData.housingPayment}
            onChange={(value) =>
              updateField("housingPayment", value === "" ? 0 : Number(value))
            }
            min={0}
            tooltip="Include rent or mortgage payment only"
          />
        );
      case 4:
        return (
          <>
            <InputField
              label="How much do you spend on utilities monthly?"
              type="number"
              value={formData.utilities}
              onChange={(value) => updateField("utilities", value)}
              min={0}
              tooltip="Include electricity, water, gas, etc."
            />
            <InputField
              label="How much do you spend on internet and phone monthly?"
              type="number"
              value={formData.internetAndPhone}
              onChange={(value) => updateField("internetAndPhone", value)}
              min={0}
              tooltip="Include internet, mobile phone, and landline if applicable"
            />
          </>
        );
      case 5:
        return (
          <InputField
            label="What are your monthly transportation costs?"
            type="number"
            value={formData.transportationCosts}
            onChange={(value) => updateField("transportationCosts", value)}
            min={0}
            tooltip="Include car payments, fuel, maintenance, public transit, etc."
          />
        );
      case 6:
        return (
          <InputField
            label="How much do you spend on health insurance monthly?"
            type="number"
            value={formData.healthInsurance}
            onChange={(value) => updateField("healthInsurance", value)}
            min={0}
            tooltip="Include health insurance premiums and regular medical expenses"
          />
        );
      case 7:
        return (
          <InputField
            label="What is your monthly grocery budget?"
            type="number"
            value={formData.groceries}
            onChange={(value) => updateField("groceries", value)}
            min={0}
            tooltip="Include food and household essentials"
          />
        );
      case 8:
        return (
          <>
            <InputField
              label="Do you have any credit card debt? If yes, how much?"
              type="number"
              value={formData.creditCardDebt}
              onChange={(value) => updateField("creditCardDebt", value)}
              min={0}
              required={false}
              tooltip="Total credit card balance"
            />
            <InputField
              label="Do you have any other loans? If yes, how much?"
              type="number"
              value={formData.otherLoans}
              onChange={(value) => updateField("otherLoans", value)}
              min={0}
              required={false}
              tooltip="Include personal loans, student loans, etc."
            />
          </>
        );
      case 9:
        return (
          <InputField
            label="How much are you currently saving monthly?"
            type="number"
            value={formData.monthlySavings}
            onChange={(value) => updateField("monthlySavings", value)}
            min={0}
            tooltip="Include all savings and investments"
          />
        );
      case 10:
        return (
          <>
            <MultiSelect
              label="Select your top 3 financial priorities"
              options={[...FINANCIAL_PRIORITIES, "Other"]}
              selected={formData.financialPriorities}
              onChange={(value) => updateField("financialPriorities", value)}
              max={3}
              tooltip="Select up to 3 priorities that align with your financial goals"
            />
            {formData.financialPriorities.includes("Other") && (
              <InputField
                label="Please specify your other financial priority"
                type="text"
                value={formData.otherPriority}
                onChange={(value) => updateField("otherPriority", value)}
                tooltip="Describe your other financial priority"
              />
            )}
            <InputField
              label="How much would you like to save monthly?"
              type="number"
              value={formData.desiredMonthlySavings}
              onChange={(value) => updateField("desiredMonthlySavings", value)}
              min={0}
              tooltip="Target monthly savings goal"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <ClipboardList className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Financial Planning Survey
          </h1>
          <p className="text-gray-600">
            Help us understand your financial situation better
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <ProgressBar currentPage={currentPage} totalPages={TOTAL_PAGES} />

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (currentPage === TOTAL_PAGES) {
                await handleSubmitSurvey();
                await generateBudget();
              } else {
                setCurrentPage((prev) => prev + 1);
              }
            }}
          >
            {renderPage()}

            <NavigationButtons
              currentPage={currentPage}
              totalPages={TOTAL_PAGES}
              onPrevious={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              onNext={async () => {
                if (currentPage === TOTAL_PAGES) {
                  await handleSubmitSurvey();
                  await generateBudget();
                } else {
                  setCurrentPage((prev) => prev + 1);
                }
              }}
              isValid={isPageValid()}
            />
          </form>

          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {budget && (
            <div>
              <h2 className="text-xl font-bold mt-6">Generated Budget</h2>
              <pre className="bg-gray-100 p-4 rounded">
                {JSON.stringify(budget, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Survey;
