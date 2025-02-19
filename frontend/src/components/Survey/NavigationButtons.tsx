import React from "react";

interface NavigationButtonsProps {
  currentPage: number;
  totalPages: number;
  handleNextPage: (e: React.FormEvent) => Promise<void>;
  handlePreviousPage: () => void;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentPage,
  totalPages,
  handleNextPage,
  handlePreviousPage,
}) => {
  return (
    <div className="flex justify-between mt-4">
      {currentPage > 1 && (
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={handlePreviousPage}
        >
          Previous
        </button>
      )}
      {currentPage < totalPages && (
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      )}
      {currentPage === totalPages && (
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;
