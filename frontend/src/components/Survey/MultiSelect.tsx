import { QuestionTooltip } from './QuestionTooltip';

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  max?: number;
  tooltip?: string;
}

export function MultiSelect({
  label,
  options,
  selected,
  onChange,
  max,
  tooltip,
}: MultiSelectProps) {
  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else if (!max || selected.length < max) {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="mb-6">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label}
        {tooltip && <QuestionTooltip text={tooltip} />}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <div
            key={option}
            onClick={() => handleToggle(option)}
            className={`p-3 border rounded-lg cursor-pointer transition-colors
              ${selected.includes(option)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-300'
              }`}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
}