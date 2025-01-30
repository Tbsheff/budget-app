import { QuestionTooltip } from './QuestionTooltip';

interface InputFieldProps {
  label: string;
  type: 'number' | 'text';
  value: number | string;
  onChange: (value: any) => void;
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
  return (
    <div className="mb-6">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {tooltip && <QuestionTooltip text={tooltip} />}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}