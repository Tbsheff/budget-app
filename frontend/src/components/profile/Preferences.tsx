import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

interface PreferencesProps {
  currency: string;
  language: string;
  isEditing: boolean;
  onInputChange: (name: string, value: string) => void;
}

interface Language {
  name: string;
}

interface Currency {
  name: string;
}

export const Preferences = ({
  currency,
  language,
  isEditing,
  onInputChange,
}: PreferencesProps) => {
  const [availableCurrencies, setAvailableCurrencies] = useState<Currency[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);

  // Fetch available currencies and languages dynamically
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [currenciesRes, languagesRes] = await Promise.all([
          axios.get<Currency[]>("/api/settings/currencies"), // Properly typed API call
          axios.get<Language[]>("/api/settings/languages"),
        ]);

        setAvailableCurrencies(currenciesRes.data);
        setAvailableLanguages(languagesRes.data);
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
            <Input id="currency" value={currency} readOnly className="bg-gray-50" />
          )}
        </div>

        {/* Preferred Language */}
        <div className="grid gap-3">
          <Label htmlFor="language">Preferred Language</Label>
          {isEditing ? (
            <select
              id="language"
              value={language}
              onChange={(e) => onInputChange("language", e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="" disabled>
                Select a language
              </option>
              {availableLanguages.map((language) => (
                <option key={language.name} value={language.name}>
                  {language.name}
                </option>
              ))}
            </select>
          ) : (
            <Input id="language" value={language} readOnly className="bg-gray-50" />
          )}
        </div>
      </div>
    </div>
  );
};
