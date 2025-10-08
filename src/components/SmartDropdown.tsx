import React, { useEffect, useRef, useState, ReactNode } from 'react';

interface SmartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export const SmartDropdown: React.FC<SmartDropdownProps> = ({
  isOpen,
  onClose,
  children,
  className = ''
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openUpward, setOpenUpward] = useState(false);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const dropdown = dropdownRef.current;
      const rect = dropdown.getBoundingClientRect();
      const dropdownHeight = 256; // max-h-64 = 256px
      const spaceBelow = window.innerHeight - rect.top;
      const spaceAbove = rect.top;

      // Open upward if there's not enough space below but enough space above
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-10" onClick={onClose} />

      {/* Dropdown */}
      <div
        ref={dropdownRef}
        className={`absolute left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto ${
          openUpward ? 'bottom-full mb-1' : 'top-full mt-1'
        } ${className}`}
      >
        {children}
      </div>
    </>
  );
};
