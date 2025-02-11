import { Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DesktopHeaderProps {
  isEditing: boolean;
  onEditToggle?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export const DesktopHeader = ({ isEditing, onEditToggle, onSave, onCancel }: DesktopHeaderProps) => {
  return (
    <div className="hidden md:flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">{isEditing ? "Edit Profile" : "Profile Settings"}</h1>

      {!isEditing && onEditToggle ? (
        <Button variant="default" onClick={onEditToggle}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      ) : isEditing && onSave && onCancel ? (
        <div className="flex gap-4">
          <Button variant="default" onClick={onSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      ) : null}
    </div>
  );
};
