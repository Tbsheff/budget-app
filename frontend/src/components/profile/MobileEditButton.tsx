import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface MobileEditButtonProps {
  onEditToggle: () => void;
}

export const MobileEditButton = ({ onEditToggle }: MobileEditButtonProps) => {
  return (
    <div className="md:hidden mt-4">
      <Button className="w-full" variant="default" onClick={onEditToggle}>
        <Edit className="w-4 h-4 mr-2" />
        Edit Profile
      </Button>
    </div>
  );
};
