import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileHeader } from "@/components/profile/MobileHeader";
import { DesktopHeader } from "@/components/profile/DesktopHeader";
import { PersonalInformation } from "@/components/profile/PersonalInformation";
import { Preferences } from "@/components/profile/Preferences";
import { MobileEditButton } from "@/components/profile/MobileEditButton";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    language: "English",
    bio: "I love managing my finances and staying on budget!",
    currency: "USD",
    theme: "light",
    notifications: true,
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <MobileHeader />

      <main className="flex-1 p-4 md:p-8 w-full md:mt-0 mt-16">
        <div className="max-w-4xl mx-auto">
          <DesktopHeader
            isEditing={isEditing}
            onEditToggle={() => setIsEditing(!isEditing)}
          />

          <div className="grid gap-8">
            <PersonalInformation
              profileData={profileData}
              isEditing={isEditing}
            />

            <Preferences
              currency={profileData.currency}
              isEditing={isEditing}
            />

            <MobileEditButton
              isEditing={isEditing}
              onEditToggle={() => setIsEditing(!isEditing)}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
