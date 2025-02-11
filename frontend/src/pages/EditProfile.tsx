import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MobileHeader } from "@/components/profile/MobileHeader";
import { DesktopHeader } from "@/components/profile/DesktopHeader";
import { Sidebar } from "@/components/Sidebar";
import { PersonalInformation } from "@/components/profile/PersonalInformation";
import { Preferences } from "@/components/profile/Preferences";
import { useToast } from "../components/ui/use-toast";
import { useUser } from "../context/userContext";
import { User } from "../context/userContext"; // Adjust the path as necessary

const EditProfile = () => {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    language: "",
    currency: "",
  });

  const [originalProfileData, setOriginalProfileData] = useState(profileData);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useUser(); // Access setUser from context

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;

        const initialProfile = {
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          phone: data.phone_number,
          language: data.language,
          currency: data.currency,
        };

        setProfileData(initialProfile);
        setOriginalProfileData(initialProfile);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const noChanges = JSON.stringify(profileData) === JSON.stringify(originalProfileData);
    if (noChanges) {
      toast({
        title: "No changes detected",
        description: "There are no changes to save.",
      });
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.put(
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

      // Correctly update user context
      setUser((prevUser: User | null) => {
        if (!prevUser) return null; // Handle the null case safely

        return {
          ...prevUser,
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          email: profileData.email,
        };
      });

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 w-full">
        <MobileHeader />
        <div className="max-w-4xl mx-auto">
          <DesktopHeader
            isEditing={true}
            onSave={handleSave}
            onCancel={() => navigate("/profile")}
          />

          <div className="grid gap-8">
            <PersonalInformation
              profileData={profileData}
              isEditing={true}
              onInputChange={handleInputChange}
            />
            <Preferences
              currency={profileData.currency}
              language={profileData.language}
              isEditing={true}
              onInputChange={handleInputChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;
