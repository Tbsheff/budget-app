interface ProgressBarProps {
  currentPage: number;
  totalPages: number;
}

export function ProgressBar({ currentPage, totalPages }: ProgressBarProps) {
  const progress = (currentPage / totalPages) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2 text-sm text-gray-600">
        <span>Progress</span>
        <span>{currentPage} of {totalPages}</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}