import React from 'react';
import { Check } from 'lucide-react';
import { SmartDropdown } from './SmartDropdown';

interface TargetGroupsDropdownProps {
  selectedGroups: string[];
  onSelectionChange: (groups: string[]) => void;
  onClose: () => void;
}

export const TargetGroupsDropdown: React.FC<TargetGroupsDropdownProps> = ({
  selectedGroups,
  onSelectionChange,
  onClose
}) => {
  const availableGroups = [
    'All Users',
    'HR',
    'Managers',
    'IT',
    'Recruiters',
    'Hiring Managers',
    'Engineering Team',
    'Legal',
    'Finance',
    'Marketing',
    'Sales',
    'Operations'
  ];

  const toggleGroup = (group: string) => {
    if (selectedGroups.includes(group)) {
      onSelectionChange(selectedGroups.filter(g => g !== group));
    } else {
      onSelectionChange([...selectedGroups, group]);
    }
  };

  return (
    <SmartDropdown isOpen={true} onClose={onClose}>
      <div className="p-2">
        <div className="py-1">
          {availableGroups.map((group) => (
            <button
              key={group}
              onClick={() => toggleGroup(group)}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedGroups.includes(group)}
                onChange={() => {}}
                className="rounded border-gray-300"
              />
              <span>{group}</span>
            </button>
          ))}
        </div>

        {selectedGroups.length > 0 && (
          <div className="border-t border-gray-100 pt-2 mt-2">
            <div className="px-3 py-2 text-xs text-gray-500">
              {selectedGroups.length} group(s) selected
            </div>
          </div>
        )}
      </div>
    </SmartDropdown>
  );
};