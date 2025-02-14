import { LucideIcon } from "lucide-react";
import {
  Home,
  Lightbulb,
  Droplet,
  ShoppingCart,
  ShoppingBag,
  Car,
  Bus,
  Fuel,
  Phone,
  Wifi,
  Stethoscope,
  Building2,
  CreditCard,
  Wallet,
  Baby,
  PawPrint,
  GraduationCap,
  Book,
  PiggyBank,
  AlertCircle,
  TrendingUp,
  LineChart,
  Building,
  Briefcase,
  Scroll,
  DollarSign,
  UtensilsCrossed,
  Pizza,
  Film,
  Music,
  Gamepad2,
  Palette,
  Plane,
  Luggage,
  Dumbbell,
  Heart,
  Gift,
  Shield,
  FileText,
  Tv,
  Wrench,
  Calculator,
  Download,
  MoreHorizontal,
  Monitor,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import axios from "axios";
import { cn } from "@/lib/utils";

const icons = [
  { icon: Home, name: "Home" },
  { icon: Lightbulb, name: "Lightbulb" },
  { icon: Droplet, name: "Droplet" },
  { icon: ShoppingCart, name: "ShoppingCart" },
  { icon: ShoppingBag, name: "ShoppingBag" },
  { icon: Car, name: "Car" },
  { icon: Bus, name: "Bus" },
  { icon: Fuel, name: "Fuel" },
  { icon: Phone, name: "Phone" },
  { icon: Wifi, name: "Wifi" },
  { icon: Stethoscope, name: "Stethoscope" },
  { icon: Building2, name: "Building2" },
  { icon: CreditCard, name: "CreditCard" },
  { icon: Wallet, name: "Wallet" },
  { icon: Baby, name: "Baby" },
  { icon: PawPrint, name: "PawPrint" },
  { icon: GraduationCap, name: "GraduationCap" },
  { icon: Book, name: "Book" },
  { icon: PiggyBank, name: "PiggyBank" },
  { icon: AlertCircle, name: "AlertCircle" },
  { icon: TrendingUp, name: "TrendingUp" },
  { icon: LineChart, name: "LineChart" },
  { icon: Building, name: "Building" },
  { icon: Briefcase, name: "Briefcase" },
  { icon: Scroll, name: "Scroll" },
  { icon: DollarSign, name: "DollarSign" },
  { icon: UtensilsCrossed, name: "UtensilsCrossed" },
  { icon: Pizza, name: "Pizza" },
  { icon: Film, name: "Film" },
  { icon: Music, name: "Music" },
  { icon: Gamepad2, name: "Gamepad2" },
  { icon: Palette, name: "Palette" },
  { icon: Plane, name: "Plane" },
  { icon: Luggage, name: "Luggage" },
  { icon: Dumbbell, name: "Dumbbell" },
  { icon: Heart, name: "Heart" },
  { icon: Gift, name: "Gift" },
  { icon: Shield, name: "Shield" },
  { icon: FileText, name: "FileText" },
  { icon: Tv, name: "Tv" },
  { icon: Wrench, name: "Wrench" },
  { icon: Calculator, name: "Calculator" },
  { icon: Download, name: "Download" },
  { icon: MoreHorizontal, name: "MoreHorizontal" },
  { icon: Monitor, name: "Monitor" },
];

interface IconPickerProps {
  value: LucideIcon;
  onChange: (icon: LucideIcon) => void;
  color?: string;
  categoryId: number; // Add categoryId to props
}

export function IconPicker({
  value: Icon,
  onChange,
  color = "text-gray-500",
  categoryId, // Destructure categoryId from props
}: IconPickerProps) {
  const handleIconChange = async (icon: LucideIcon) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      // Update the icon_name in the backend
      await axios.put(
        `/api/categories/${categoryId}/icon`,
        {
          icon_name: icon.displayName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Call the onChange prop to update the icon in the frontend
      onChange(icon);
    } catch (error) {
      console.error("Error updating icon:", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors touch-manipulation">
          <Icon className={cn("w-5 h-5 md:w-6 md:h-6", color)} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[280px] md:w-[320px] p-3 bg-white shadow-lg rounded-md z-50 border border-gray-300"
        side="right"
        align="start"
        sideOffset={5}
      >
        <div className="grid grid-cols-4 md:grid-cols-5 gap-3 max-h-[60vh] overflow-y-auto">
          {icons.map((IconOption) => (
            <button
              key={IconOption.icon.displayName}
              className="p-3 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-center touch-manipulation"
              onClick={() => {
                handleIconChange(IconOption.icon);
                onChange(IconOption.icon); // Update the icon immediately in the frontend
              }}
              title={IconOption.icon.displayName}
            >
              <IconOption.icon className="w-6 h-6 md:w-7 md:h-7 text-gray-600" />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
