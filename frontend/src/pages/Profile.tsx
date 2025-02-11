import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MobileHeader } from "@/components/profile/MobileHeader";
import { DesktopHeader } from "@/components/profile/DesktopHeader";
import { Sidebar } from "@/components/Sidebar";
import { PersonalInformation } from "@/components/profile/PersonalInformation";
import { Preferences } from "@/components/profile/Preferences";
import { MobileEditButton } from "@/components/profile/MobileEditButton";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    language: "",
    currency: "",
  });

  const navigate = useNavigate();

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
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 w-full">
        <MobileHeader />
        <div className="max-w-4xl mx-auto">
          <DesktopHeader isEditing={false} onEditToggle={() => navigate("/edit-profile")} />

          <div className="grid gap-8">
            <PersonalInformation
              profileData={profileData}
              isEditing={false}
              onInputChange={() => {}}
            />
            <Preferences
              currency={profileData.currency}
              language={profileData.language}
              isEditing={false}
              onInputChange={() => {}}
            />

            <MobileEditButton onEditToggle={() => navigate("/edit-profile")} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
