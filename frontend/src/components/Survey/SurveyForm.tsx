import React from "react";
import { NavigationButtons } from "./NavigationButtons";
import { SurveyPages } from "./SurveyPages";
import { SurveyData } from "../../types";

interface SurveyFormProps {
  currentPage: number;
  formData: SurveyData;
  updateField: (
    field: keyof SurveyData,
    value: string | number | string[]
  ) => void;
  setCurrentPage: (page: number) => void;
  handleSubmitSurvey: () => Promise<void>;
}

export const SurveyForm: React.FC<SurveyFormProps> = ({
  currentPage,
  formData,
  updateField,
  setCurrentPage,
  handleSubmitSurvey,
}) => {
  const TOTAL_PAGES = 10;

  const handleNext = async () => {
    if (currentPage === TOTAL_PAGES) {
      await handleSubmitSurvey();
    } else {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await handleNext();
      }}
    >
      <SurveyPages
        currentPage={currentPage}
        formData={formData}
        updateField={updateField}
      />
      <NavigationButtons
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onPrevious={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        onNext={handleNext}
        isValid={true} // Placeholder, can add validation logic
      />
    </form>
  );
};
