import { QuestionTooltip } from './QuestionTooltip';

interface InputFieldProps {
  label: string;
  type: 'number' | 'text';
  value: string | number;
  onChange: (value: string | number) => void;
  tooltip?: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
}

export function InputField({
  label,
  type,
  value,
  onChange,
  tooltip,
  placeholder,
  required = true,
  min,
  max,
}: InputFieldProps) {

  // Handle input change and keep empty input as an empty string
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty strings for user-friendly backspacing
    if (type === 'number' && inputValue === "") {
      onChange("");
    } else {
      onChange(type === 'number' ? Number(inputValue) : inputValue);
    }
  };

  return (
    <div className="mb-6">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {tooltip && <QuestionTooltip text={tooltip} />}
      </label>
      <input
        type={type}
        value={value === 0 ? "" : value}  // Avoid displaying 0 by default
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
