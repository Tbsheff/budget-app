import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

interface PreferencesProps {
  currency: string;
  isEditing: boolean;
  onInputChange: (name: string, value: string) => void;
}

interface Currency {
  name: string;
}

export const Preferences = ({
  currency,
  isEditing,
  onInputChange,
}: PreferencesProps) => {
  const [availableCurrencies, setAvailableCurrencies] = useState<Currency[]>(
    []
  );

  // Fetch available currencies and languages dynamically
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [currenciesRes] = await Promise.all([
          axios.get<Currency[]>("/api/settings/currencies"), // Properly typed API call
        ]);

        setAvailableCurrencies(currenciesRes.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Preferences</h2>
      <div className="space-y-4">
        {/* Default Currency */}
        <div className="grid gap-3">
          <Label htmlFor="currency">Default Currency</Label>
          {isEditing ? (
            <select
              id="currency"
              value={currency}
              onChange={(e) => onInputChange("currency", e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="" disabled>
                Select a currency
              </option>
              {availableCurrencies.map((currency) => (
                <option key={currency.name} value={currency.name}>
                  {currency.name}
                </option>
              ))}
            </select>
          ) : (
            <Input
              id="currency"
              value={currency}
              readOnly
              className="bg-gray-50"
            />
          )}
        </div>
      </div>
    </div>
  );
};
