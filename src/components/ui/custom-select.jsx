import React, { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export function CustomSelect({ options, value, onChange, placeholder = "Select option...", className = "", variant = "light" }) {
  const [isOpen, setIsOpen] = useState(false);

  const displayLabel = () => {
    const selected = options.find(o => 
      (typeof o === 'object' ? o.value === value : o === value)
    );
    if (!selected) return placeholder;
    return typeof selected === 'object' ? selected.label : selected;
  };

  const isDark = variant === "dark";

  return (
    <div 
      className={`relative w-full ${className}`}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full h-[48px] rounded-xl border-2 transition-all duration-300 px-4 py-2 text-sm font-semibold shadow-sm
          ${isDark 
            ? (isOpen ? "border-white/40 ring-4 ring-white/10 bg-[#2a2a2a]" : "border-transparent bg-transparent hover:bg-white/5 text-white placeholder-gray-400")
            : (isOpen ? "border-indigo-400 ring-4 ring-indigo-50 bg-white" : "border-gray-200 bg-white hover:border-gray-300 text-gray-700")
          }
        `}
      >
        <span className={`truncate flex-1 text-left ${!value ? (isDark ? "text-gray-400 font-medium" : "text-gray-400 font-medium") : (isDark ? "text-white" : "text-gray-900")}`}>
          {displayLabel()}
        </span>
        <ChevronDown className={`h-5 w-5 ml-2 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className={`absolute left-0 right-0 z-50 mt-2 w-full rounded-2xl border shadow-xl py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top
          ${isDark ? "bg-[#1e1e1e] border-white/10 text-white" : "bg-white border-gray-100 text-gray-900"}
        `}>
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option) => {
              const optValue = typeof option === 'object' ? option.value : option;
              const optLabel = typeof option === 'object' ? option.label : option;
              const isSelected = value === optValue;
              
              return (
                <button
                  key={optValue}
                  type="button"
                  onClick={() => {
                    onChange(optValue);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition-all duration-200 flex items-center justify-between
                    ${isSelected 
                      ? (isDark ? "bg-white/10 text-white font-bold" : "bg-indigo-50 text-indigo-700 font-bold") 
                      : (isDark ? "text-gray-300 hover:bg-white/5 hover:text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")}
                  `}
                >
                  <span className="truncate">{optLabel}</span>
                  {isSelected && <Check className={`h-4 w-4 shrink-0 ${isDark ? "text-white" : "text-indigo-600"}`} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
