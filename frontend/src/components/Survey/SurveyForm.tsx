import React from "react";
import NavigationButtons from "./NavigationButtons";
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

  const handleNextPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPage === TOTAL_PAGES) {
      await handleSubmitSurvey();
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage(Math.max(1, currentPage - 1));
  };

  return (
    <form onSubmit={handleNextPage}>
      <SurveyPages
        currentPage={currentPage}
        formData={formData}
        updateField={updateField}
      />
      <NavigationButtons
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
      />
    </form>
  );
};
