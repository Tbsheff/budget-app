import React from "react";
import { InputField } from "./InputField";
import { MultiSelect } from "./MultiSelect";
import { Select } from "./Select";
import { SurveyData } from "../../types";

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

interface SurveyPagesProps {
  currentPage: number;
  formData: SurveyData;
  updateField: (
    field: keyof SurveyData,
    value: string | number | string[]
  ) => void;
}

export const SurveyPages: React.FC<SurveyPagesProps> = ({
  currentPage,
  formData,
  updateField,
}) => {
  switch (currentPage) {
    case 1:
      return (
        <>
          <InputField
            label="What is your age?"
            type="number"
            value={formData.age}
            onChange={(value) => updateField("age", Number(value))}
            min={18}
            max={100}
            tooltip="Must be at least 18 years old"
          />
          <InputField
            label="What is your target retirement age?"
            type="number"
            value={formData.targetRetirementAge}
            onChange={(value) =>
              updateField("targetRetirementAge", Number(value))
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
            tooltip="Select your employment status"
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
            onChange={(value) => updateField("monthlyIncome", Number(value))}
            min={0}
            tooltip="Net income after tax deductions"
          />
          <InputField
            label="Do you have any additional sources of income? If yes, how much monthly?"
            type="number"
            value={
              formData.additionalIncome === 0 ? "" : formData.additionalIncome
            }
            onChange={(value) =>
              updateField("additionalIncome", value === "" ? 0 : Number(value))
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
          value={formData.housingPayment}
          onChange={(value) => updateField("housingPayment", Number(value))}
          min={0}
          tooltip="Include only rent or mortgage payments"
        />
      );

    case 4:
      return (
        <>
          <InputField
            label="Monthly utility expenses (electricity, water, gas, etc.)"
            type="number"
            value={formData.utilities}
            onChange={(value) => updateField("utilities", Number(value))}
            min={0}
          />
          <InputField
            label="Monthly internet & phone expenses"
            type="number"
            value={formData.internetAndPhone}
            onChange={(value) => updateField("internetAndPhone", Number(value))}
            min={0}
          />
        </>
      );

    case 5:
      return (
        <InputField
          label="Monthly transportation costs (fuel, car payments, public transit)"
          type="number"
          value={formData.transportationCosts}
          onChange={(value) =>
            updateField("transportationCosts", Number(value))
          }
          min={0}
        />
      );

    case 6:
      return (
        <InputField
          label="Monthly health insurance costs"
          type="number"
          value={formData.healthInsurance}
          onChange={(value) => updateField("healthInsurance", Number(value))}
          min={0}
        />
      );

    case 7:
      return (
        <InputField
          label="Monthly grocery expenses"
          type="number"
          value={formData.groceries}
          onChange={(value) => updateField("groceries", Number(value))}
          min={0}
        />
      );

    case 8:
      return (
        <>
          <InputField
            label="Do you have credit card debt? If yes, how much?"
            type="number"
            value={formData.creditCardDebt}
            onChange={(value) => updateField("creditCardDebt", Number(value))}
            min={0}
            required={false}
          />
          <InputField
            label="Do you have other loans? If yes, how much?"
            type="number"
            value={formData.otherLoans}
            onChange={(value) => updateField("otherLoans", Number(value))}
            min={0}
            required={false}
          />
        </>
      );

    case 9:
      return (
        <InputField
          label="How much are you currently saving per month?"
          type="number"
          value={formData.monthlySavings}
          onChange={(value) => updateField("monthlySavings", Number(value))}
          min={0}
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
            tooltip="Select up to 3 financial priorities"
          />
          {formData.financialPriorities.includes("Other") && (
            <InputField
              label="Please specify your other financial priority"
              type="text"
              value={formData.otherPriority}
              onChange={(value) => updateField("otherPriority", value)}
            />
          )}
          <InputField
            label="How much would you like to save monthly?"
            type="number"
            value={formData.desiredMonthlySavings}
            onChange={(value) =>
              updateField("desiredMonthlySavings", Number(value))
            }
            min={0}
            tooltip="Enter your target savings goal"
          />
        </>
      );

    default:
      return null;
  }
};
