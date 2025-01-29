import { HelpCircle } from 'lucide-react';
import { useState } from 'react';

interface QuestionTooltipProps {
  text: string;
}

export function QuestionTooltip({ text }: QuestionTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block ml-2">
      <HelpCircle
        className="w-4 h-4 text-blue-500 cursor-help inline-block"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      />
      {isVisible && (
        <div className="absolute z-10 w-64 p-2 text-sm text-white bg-gray-800 rounded-md shadow-lg -right-2 bottom-full mb-2">
          {text}
          <div className="absolute bottom-[-6px] right-3 w-3 h-3 bg-gray-800 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
}