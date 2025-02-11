export interface SurveyData {
  // Basic Demographics
  age: number | undefined;
  targetRetirementAge: number | undefined;
  employmentStatus: string;

  // Employment & Income
  monthlyIncome: number | undefined;
  additionalIncome: number | undefined;

  // Housing
  housingPayment: number | undefined;
  hoaAndTaxes: number | undefined;

  // Essential Bills
  utilities: number | undefined;
  internetAndPhone: number | undefined;

  // Transportation
  transportationCosts: number | undefined;
  fuelAndMaintenance: number | undefined;

  // Insurance
  healthInsurance: number | undefined;
  otherInsurance: number | undefined;

  // Living Expenses
  groceries: number | undefined;
  entertainment: number | undefined;

  // Debt
  studentLoans: number | undefined;
  creditCardDebt: number | undefined;
  otherLoans: number | undefined;

  // Savings
  monthlySavings: number | undefined;
  retirementPercentage: number | undefined;

  // Goals
  financialPriorities: string[];
  otherPriority: string;
  desiredMonthlySavings: number | undefined;
}

export const initialSurveyData: SurveyData = {
  age: undefined,
  targetRetirementAge: undefined,
  employmentStatus: "",
  monthlyIncome: undefined,
  additionalIncome: undefined,
  housingPayment: undefined,
  hoaAndTaxes: undefined,
  utilities: undefined,
  internetAndPhone: undefined,
  transportationCosts: undefined,
  fuelAndMaintenance: undefined,
  healthInsurance: undefined,
  otherInsurance: undefined,
  groceries: undefined,
  entertainment: undefined,
  studentLoans: undefined,
  creditCardDebt: undefined,
  otherLoans: undefined,
  monthlySavings: undefined,
  retirementPercentage: undefined,
  financialPriorities: [],
  otherPriority: "",
  desiredMonthlySavings: undefined,
};
