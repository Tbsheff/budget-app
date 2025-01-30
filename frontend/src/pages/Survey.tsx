import React, { useState, useEffect } from "react";
import { ProgressBar } from "../components/Survey/ProgressBar";
import { NavigationButtons } from "../components/Survey/NavigationButtons";
import { InputField } from "../components/Survey/InputField";
import { MultiSelect } from "../components/Survey/MultiSelect";
import { Select } from "../components/Survey/Select";
import { SurveyData, initialSurveyData } from "../types";
import { ClipboardList } from "lucide-react";

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
  const [formData, setFormData] = useState<SurveyData>(() => {
    const saved = localStorage.getItem("financialSurvey");
    return saved ? JSON.parse(saved) : initialSurveyData;
  });

  useEffect(() => {
    localStorage.setItem("financialSurvey", JSON.stringify(formData));
  }, [formData]);

  const updateField = (field: keyof SurveyData, value: string | number | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
        return true; // Optional debt fields
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

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <>
            <InputField
              label="What is your age?"
              type="number"
              value={formData.age}
              onChange={(value) => updateField("age", value)}
              min={18}
              max={100}
              tooltip="Must be at least 18 years old"
            />
            <InputField
              label="What is your target retirement age?"
              type="number"
              value={formData.targetRetirementAge}
              onChange={(value) => updateField("targetRetirementAge", value)}
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
              value={formData.monthlyIncome}
              onChange={(value) => updateField("monthlyIncome", value)}
              min={0}
              tooltip="Your net income after all tax deductions"
            />
            <InputField
              label="Do you have any additional sources of income? If yes, how much monthly?"
              type="number"
              value={formData.additionalIncome}
              onChange={(value) => updateField("additionalIncome", value)}
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
            value={formData.housingPayment}
            onChange={(value) => updateField("housingPayment", value)}
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

          <form onSubmit={(e) => e.preventDefault()}>
            {renderPage()}

            <NavigationButtons
              currentPage={currentPage}
              totalPages={TOTAL_PAGES}
              onPrevious={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              onNext={() =>
                setCurrentPage((prev) => Math.min(TOTAL_PAGES, prev + 1))
              }
              isValid={isPageValid()}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Survey;
