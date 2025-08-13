"use client";
import React, { useState, useRef, useEffect } from "react";

interface DropdownItem {
  name: string;
  url?: string; 
  id: string;
}

interface DropdownProps {
  items: DropdownItem[];
  label: string;
  onSelect: (item: DropdownItem) => void;
  selectedItem?: DropdownItem | null; 
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  label,
  onSelect,
  selectedItem,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

const handleSelect = (item: DropdownItem) => {
    onSelect(item);
    setIsOpen(false);  
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={toggleDropdown}
          className="inline-flex w-full justify-between  rounded-lg  border border-s5 px-4 py-2 text-xs text-light-1 shadow-sm  hover:bg-dark-s4"
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {selectedItem ? selectedItem.name : label}
          <svg
            className={`-mr-1 ml-2 h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 9l6 6 6-6"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-lg bg-dark-2 shadow-lg ring-1 ring-dark-4"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="p-1">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="group flex w-full items-center rounded-lg px-4 py-2 text-sm text-light-1 hover:bg-dark-4 focus:outline-none"
                role="menuitem"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
