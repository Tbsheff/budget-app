import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PreferencesProps {
  currency: string;
  isEditing: boolean;
  onInputChange: (name: string, value: string) => void;
}

export const Preferences = ({ currency, isEditing, onInputChange }: PreferencesProps) => {
  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur(); // Blur the current input field
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Preferences</h2>
      <div className="space-y-4">
        <div className="grid gap-3">
          <Label htmlFor="currency">Default Currency</Label>
          <Input
            id="currency"
            name="currency"
            value={currency}
            readOnly={!isEditing}
            className={!isEditing ? "bg-gray-50" : ""}
            onChange={(e) => onInputChange(e.target.name, e.target.value)}
            onKeyDown={handleEnterKey}
          />
        </div>
      </div>
    </div>
  );
};
