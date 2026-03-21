import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export function CustomSelect({ options, value, onChange, placeholder = "Select...", className = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  const displayLabel = () => {
    const selected = options.find(o => 
      (typeof o === 'object' ? o.value === value : o === value)
    );
    if (!selected) return value || placeholder;
    return typeof selected === 'object' ? selected.label : selected;
  };

  return (
    <div 
      className={`relative w-full ${className}`}
      tabIndex={-1} 
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full h-[42px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors shadow-sm"
      >
        <span className="truncate font-medium text-left flex-1">{displayLabel()}</span>
        <ChevronDown className="h-4 w-4 text-gray-500 ml-2 flex-shrink-0" />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg py-1 overflow-hidden pointer-events-auto max-h-60 overflow-y-auto">
          {options.map((option) => {
            const optValue = typeof option === 'object' ? option.value : option;
            const optLabel = typeof option === 'object' ? option.label : option;
            return (
              <button
                key={optValue}
                type="button"
                onClick={() => {
                  onChange(optValue);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  value === optValue 
                    ? "bg-gray-100 font-semibold text-gray-900 border-l-2 border-gray-900" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-l-2 border-transparent"
                }`}
              >
                {optLabel}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
