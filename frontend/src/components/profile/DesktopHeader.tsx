import { Edit, Save, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DesktopHeaderProps {
  isEditing: boolean;
  onEditToggle: () => void;
}

export const DesktopHeader = ({ isEditing, onEditToggle }: DesktopHeaderProps) => {
  return (
    <div className="hidden md:flex justify-between items-center mb-8">
      <div className="flex items-center gap-3">
        <User className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold">Profile Settings</h1>
      </div>
      <Button
        variant={isEditing ? "default" : "outline"}
        onClick={onEditToggle}
      >
        {isEditing ? (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </>
        ) : (
          <>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </>
        )}
      </Button>
    </div>
  );
};