import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PreferencesProps {
  currency: string;
  isEditing: boolean;
}

export const Preferences = ({ currency, isEditing }: PreferencesProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Preferences</h2>
      <div className="space-y-4">
        <div className="grid gap-3">
          <Label htmlFor="currency">Default Currency</Label>
          <Input
            id="currency"
            value={currency}
            readOnly={!isEditing}
            className={!isEditing ? "bg-gray-50" : ""}
          />
        </div>
      </div>
    </div>
  );
};