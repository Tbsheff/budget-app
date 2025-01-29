import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PersonalInformationProps {
  profileData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    language: string;
    bio: string;
  };
  isEditing: boolean;
}

export const PersonalInformation = ({
  profileData,
  isEditing,
}: PersonalInformationProps) => {
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
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={profileData.lastName}
              readOnly={!isEditing}
              className={!isEditing ? "bg-gray-50" : ""}
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
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={profileData.phone}
            readOnly={!isEditing}
            className={!isEditing ? "bg-gray-50" : ""}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="language">Preferred Language</Label>
          <Input
            id="language"
            value={profileData.language}
            readOnly={!isEditing}
            className={!isEditing ? "bg-gray-50" : ""}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={profileData.bio}
            readOnly={!isEditing}
            className={!isEditing ? "bg-gray-50" : ""}
          />
        </div>
      </div>
    </div>
  );
};