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

import { cn } from "@/lib/utils";
const defaultIcon = Home;

const icons = [
  // Income & Savings
  { icon: Download, name: "Income" },
  { icon: PiggyBank, name: "Savings" },
  { icon: Wallet, name: "Emergency Fund" },

  // Housing & Utilities
  { icon: Home, name: "Housing" },
  { icon: Lightbulb, name: "Electricity" },
  { icon: Droplet, name: "Water" },
  { icon: Building2, name: "Rent" },

  // Transportation
  { icon: Car, name: "Car" },
  { icon: Bus, name: "Transit" },
  { icon: Fuel, name: "Gas" },

  // Shopping & Food
  { icon: ShoppingCart, name: "Groceries" },
  { icon: ShoppingBag, name: "Shopping" },
  { icon: UtensilsCrossed, name: "Dining" },
  { icon: Pizza, name: "Takeout" },

  // Technology & Communication
  { icon: Phone, name: "Phone" },
  { icon: Wifi, name: "Internet" },
  { icon: Monitor, name: "Computer" },
  { icon: Tv, name: "Streaming" },

  // Health & Wellness
  { icon: Stethoscope, name: "Healthcare" },
  { icon: Dumbbell, name: "Fitness" },

  // Financial
  { icon: CreditCard, name: "Credit Card" },
  { icon: DollarSign, name: "Expenses" },
  { icon: TrendingUp, name: "Investments" },
  { icon: LineChart, name: "Stocks" },

  // Education
  { icon: GraduationCap, name: "Education" },
  { icon: Book, name: "Books" },
  { icon: Scroll, name: "Student Loans" },

  // Entertainment & Hobbies
  { icon: Film, name: "Movies" },
  { icon: Music, name: "Music" },
  { icon: Gamepad2, name: "Gaming" },
  { icon: Palette, name: "Hobbies" },

  // Travel & Transport
  { icon: Plane, name: "Travel" },
  { icon: Luggage, name: "Luggage" },

  // Other
  { icon: Heart, name: "Charity" },
  { icon: Gift, name: "Gifts" },
  { icon: Shield, name: "Insurance" },
  { icon: FileText, name: "Bills" },
  { icon: Wrench, name: "Repairs" },
  { icon: Calculator, name: "Taxes" },
  { icon: Building, name: "Business" },
  { icon: Briefcase, name: "Work" },
  { icon: AlertCircle, name: "Alert" },
  { icon: MoreHorizontal, name: "More" },
];

interface IconPickerProps {
  value: LucideIcon;
  onChange: (icon: LucideIcon) => void;
  color?: string;
}

export function IconPicker({
  value: Icon,
  onChange,
  color = "text-gray-500",
}: IconPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors touch-manipulation">
          <Icon className={cn("w-5 h-5 md:w-6 md:h-6", color)} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[280px] md:w-[320px] p-3"
        side="right"
        align="start"
        sideOffset={5}
      >
        <div className="grid grid-cols-4 md:grid-cols-5 gap-3 max-h-[60vh] overflow-y-auto">
          {icons.map((IconOption) => (
            <button
              key={IconOption.name}
              className="p-3 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-center touch-manipulation"
              onClick={() => onChange(IconOption.icon)}
              title={IconOption.name}
            >
              <IconOption.icon className="w-6 h-6 md:w-7 md:h-7 text-gray-600" />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}