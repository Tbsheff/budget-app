interface NavigationButtonsProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  isValid: boolean;
}

export function NavigationButtons({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  isValid
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between mt-8">
      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
        className={`px-6 py-2 rounded-lg font-medium transition-colors
          ${currentPage === 1
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
      >
        Previous
      </button>
      <button
        onClick={onNext}
        disabled={!isValid}
        className={`px-6 py-2 rounded-lg font-medium transition-colors
          ${!isValid
            ? 'bg-blue-200 text-blue-400 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
      >
        {currentPage === totalPages ? 'Submit' : 'Next'}
      </button>
    </div>
  );
}