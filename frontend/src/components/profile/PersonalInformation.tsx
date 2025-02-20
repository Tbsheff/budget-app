import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // If you have a switch UI component
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"; // UI dropdown

interface PersonalInformationProps {
  profileData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
}

export const PersonalInformation = ({
  profileData,
  isEditing,
  onInputChange,
}: PersonalInformationProps) => {
  const [localPhone, setLocalPhone] = useState(profileData.phone);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [colorblindMode, setColorblindMode] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("colorblindMode") : null
  );

  useEffect(() => {
    setLocalPhone(profileData.phone);
  }, [profileData.phone]);

  useEffect(() => {
    if (colorblindMode) {
      document.body.classList.add(colorblindMode);
      localStorage.setItem("colorblindMode", colorblindMode);
    } else {
      document.body.classList.remove(
        "colorblind-deuteranopia",
        "colorblind-protanopia",
        "colorblind-tritanopia",
        "colorblind-grayscale"
      );
      localStorage.removeItem("colorblindMode");
    }
  }, [colorblindMode]);

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    setLocalPhone(value);
    if (cleaned.length > 11 || (cleaned.length > 10 && !cleaned.startsWith("1"))) {
      setPhoneError("Phone number must be exactly 10 digits or start with +1.");
    } else {
      setPhoneError(null);
    }
  };

  const handlePhoneBlur = () => {
    const cleaned = localPhone.replace(/\D/g, "");
    if (cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith("1"))) {
      const formatted = `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      setLocalPhone(formatted);
      onInputChange("phone", formatted);
    }
  };

  const handleColorblindChange = (mode: string) => {
    setColorblindMode(mode !== "none" ? mode : null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-3">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={profileData.firstName}
              readOnly={!isEditing}
              className={!isEditing ? "bg-gray-50" : ""}
              onChange={(e) => onInputChange("firstName", e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={profileData.lastName}
              readOnly={!isEditing}
              className={!isEditing ? "bg-gray-50" : ""}
              onChange={(e) => onInputChange("lastName", e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            readOnly={!isEditing}
            className={!isEditing ? "bg-gray-50" : ""}
            onChange={(e) => onInputChange("email", e.target.value)}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="text"
            value={localPhone}
            readOnly={!isEditing}
            className={!isEditing ? "bg-gray-50" : ""}
            placeholder="(555) 123-4567"
            onChange={(e) => handlePhoneChange(e.target.value)}
            onBlur={handlePhoneBlur}
          />
          {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
        </div>

        {/* ✅ Colorblind Mode Setting */}
        <div className="grid gap-3">
          <Label htmlFor="colorblind-mode">Colorblind Mode</Label>
          <Select onValueChange={handleColorblindChange} value={colorblindMode || "none"}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a colorblind mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="colorblind-deuteranopia">Deuteranopia</SelectItem>
              <SelectItem value="colorblind-protanopia">Protanopia</SelectItem>
              <SelectItem value="colorblind-tritanopia">Tritanopia</SelectItem>
              <SelectItem value="colorblind-grayscale">Grayscale</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
