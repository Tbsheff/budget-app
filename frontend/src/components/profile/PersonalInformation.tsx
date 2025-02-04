import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalInformationProps {
  profileData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    language: string;
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

  // Keep phone number in sync with parent state
  useEffect(() => {
    setLocalPhone(profileData.phone);
  }, [profileData.phone]);

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith("1")) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return value;
  };

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    setLocalPhone(value); // Update local phone state before validation

    if (cleaned.length > 11 || (cleaned.length > 10 && !cleaned.startsWith("1"))) {
      setPhoneError("Phone number must be exactly 10 digits or start with +1.");
    } else {
      setPhoneError(null);
    }
  };

  const handlePhoneBlur = () => {
    const cleaned = localPhone.replace(/\D/g, "");
    if (cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith("1"))) {
      const formatted = formatPhoneNumber(localPhone);
      setLocalPhone(formatted);
      onInputChange("phone", formatted); // Update the parent state only on blur
    }
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur(); // Blur the current input field
    }
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
              onKeyDown={handleEnterKey}
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
              onKeyDown={handleEnterKey}
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
            onKeyDown={handleEnterKey}
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
            onKeyDown={handleEnterKey}
          />
          {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
        </div>

        <div className="grid gap-3">
          <Label htmlFor="language">Preferred Language</Label>
          <Input
            id="language"
            value={profileData.language}
            readOnly={!isEditing}
            className={!isEditing ? "bg-gray-50" : ""}
            onChange={(e) => onInputChange("language", e.target.value)}
            onKeyDown={handleEnterKey}
          />
        </div>
      </div>
    </div>
  );
};
