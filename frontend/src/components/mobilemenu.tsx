import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

export function MobileMenu() {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 shadow-md">
      <div className="flex items-center justify-between">
        {/* Hamburger Menu Button */}
        <Sheet>
          <SheetTrigger>
            <Menu className="w-6 h-6 text-gray-600" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            {/* ✅ This ensures only one close button */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              {/* "X" Button */}
              <SheetClose>
                <X className="w-6 h-6 text-gray-600 hover:text-gray-800" />
              </SheetClose>
            </div>

            {/* Sidebar without extra profile button */}
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
