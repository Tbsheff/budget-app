
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BudgetGroup {
  budget_group_id: string;
  group_name: string;
}

interface GroupSelectProps {
  groups: BudgetGroup[];
  selectedGroupId: string | null;
  selectedGroupName: string;
  onGroupSelect: (groupId: string, groupName: string) => void;
}

export const GroupSelect: React.FC<GroupSelectProps> = ({
  groups,
  selectedGroupId,
  selectedGroupName,
  onGroupSelect,
}) => {
  return (
    <div className="space-y-4">
      <Label>Select a budget group</Label>
      <Select 
        onValueChange={(value) => {
          const group = groups.find(g => g.budget_group_id === value);
          onGroupSelect(value, group?.group_name || "");
        }}
        value={selectedGroupId || undefined}
      >
        <SelectTrigger>
          <SelectValue placeholder="Choose a group" />
        </SelectTrigger>
        <SelectContent>
          {groups && groups.length > 0 ? (
            groups.map((group) => (
              <SelectItem key={group.budget_group_id} value={group.budget_group_id}>
                {group.group_name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="" disabled>
              No budget groups available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      {selectedGroupName && (
        <p className="text-sm text-purple-600">Selected: {selectedGroupName}</p>
      )}
    </div>
  );
};
