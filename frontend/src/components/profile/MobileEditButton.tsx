import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";

interface MobileEditButtonProps {
  isEditing: boolean;
  onEditToggle: () => void;
}

export const MobileEditButton = ({
  isEditing,
  onEditToggle,
}: MobileEditButtonProps) => {
  return (
    <div className="md:hidden">
      <Button
        className="w-full"
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