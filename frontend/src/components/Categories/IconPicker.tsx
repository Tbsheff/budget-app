import React, { useState, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { Input } from "../ui/input";
import { X } from "lucide-react";

interface IconPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (iconName: string, color: string) => void;
  currentIcon?: string;
  currentColor?: string;
}

const colors = [
  { name: "Default", class: "text-gray-600" },
  { name: "Red", class: "text-red-500" },
  { name: "Blue", class: "text-blue-500" },
  { name: "Green", class: "text-green-500" },
  { name: "Purple", class: "text-purple-500" },
  { name: "Yellow", class: "text-yellow-500" },
  { name: "Pink", class: "text-pink-500" },
  { name: "Indigo", class: "text-indigo-500" },
];

export function IconPicker({
  isOpen,
  onClose,
  onSelect,
  currentIcon,
  currentColor,
}: IconPickerProps) {
  const [search, setSearch] = useState("");
  const [selectedColor, setSelectedColor] = useState(
    currentColor || "text-gray-600"
  );

  const icons = useMemo(() => {
    return Object.entries(LucideIcons)
      .filter(
        ([name]) =>
          name.toLowerCase().includes(search.toLowerCase()) &&
          name !== "createLucideIcon" &&
          typeof LucideIcons[name as keyof typeof LucideIcons] === "function"
      )
      .map(([name, Icon]) => ({
        name,
        Icon: Icon as React.ElementType,
      }));
  }, [search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Choose an Icon</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <Input
            type="text"
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />

          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.class}
                onClick={() => setSelectedColor(color.class)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedColor === color.class
                    ? "ring-2 ring-offset-2 ring-blue-500"
                    : "hover:bg-gray-100"
                } ${color.class}`}
              >
                {color.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 max-h-[400px] overflow-y-auto p-2">
            {icons.map(({ name, Icon }) => (
              <button
                key={name}
                onClick={() => onSelect(name, selectedColor)}
                className={`p-3 rounded-lg hover:bg-gray-100 flex flex-col items-center gap-2 ${
                  currentIcon === name ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <Icon className={`w-6 h-6 ${selectedColor}`} />
                <span className="text-xs text-gray-600 truncate w-full text-center">
                  {name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
