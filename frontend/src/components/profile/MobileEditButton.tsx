import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";

interface MobileEditButtonProps {
  isEditing: boolean;
  onEditToggle: () => void;
  onSave: () => void;  // New prop for handling save
}

export const MobileEditButton = ({
  isEditing,
  onEditToggle,
  onSave,
}: MobileEditButtonProps) => {
  return (
    <div className="md:hidden">
      {isEditing ? (
        <Button className="w-full" variant="default" onClick={onSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      ) : (
        <Button className="w-full" variant="outline" onClick={onEditToggle}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      )}
    </div>
  );
};
