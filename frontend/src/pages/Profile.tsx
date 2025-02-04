import { useState, useEffect } from "react";
import axios from "axios";
import { Sidebar } from "@/components/Sidebar";
import { MobileHeader } from "@/components/profile/MobileHeader";
import { DesktopHeader } from "@/components/profile/DesktopHeader";
import { PersonalInformation } from "@/components/profile/PersonalInformation";
import { Preferences } from "@/components/profile/Preferences";
import { MobileEditButton } from "@/components/profile/MobileEditButton";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    language: "",
    currency: "",
  });

  const [initialProfileData, setInitialProfileData] = useState(profileData); // Track original data
  const [changesMade, setChangesMade] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;

        setProfileData({
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          phone: data.phone_number,
          language: data.language,
          currency: data.currency,
        });

        setInitialProfileData({
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          phone: data.phone_number,
          language: data.language,
          currency: data.currency,
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  // Detect changes to profile data
  useEffect(() => {
    setChangesMade(JSON.stringify(profileData) !== JSON.stringify(initialProfileData));
  }, [profileData]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    if (!changesMade) {
      console.log("No changes to save.");
      alert("No changes to save.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        "/api/users/profile",
        {
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          email: profileData.email,
          phone_number: profileData.phone,
          language: profileData.language,
          currency: profileData.currency,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Profile updated successfully.");
      setInitialProfileData(profileData); // Reset initial state
      setIsEditing(false);
    } catch (error) {
      console.error("Error during PUT request:", error); // Log error if request fails
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <MobileHeader />

      <main className="flex-1 p-4 md:p-8 w-full md:mt-0 mt-16">
        <div className="max-w-4xl mx-auto">
          <DesktopHeader isEditing={isEditing} onEditToggle={() => setIsEditing(!isEditing)} />

          <div className="grid gap-8">
            <PersonalInformation
              profileData={profileData}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />
            <Preferences
              currency={profileData.currency}
              isEditing={isEditing}
              onInputChange={(value) => handleInputChange("currency", value)}
            />

            <MobileEditButton
              isEditing={isEditing}
              onEditToggle={() => {
                if (!isEditing && changesMade) {
                  if (window.confirm("You have unsaved changes. Do you want to save them?")) {
                    handleSaveProfile();
                  }
                }
                setIsEditing(!isEditing);
              }}
              onSave={handleSaveProfile}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
