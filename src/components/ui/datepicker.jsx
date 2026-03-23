import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import clsx from "clsx";

export function DatePicker({ value, onChange, placeholder, className, variant = "light", showIcon = true }) {
  const [inputValue, setInputValue] = useState("");

  // Sync external 'YYYY-MM-DD' value to internal 'DD/MM/YYYY' input
  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split('-');
      if (y && m && d) {
        setInputValue(`${d}/${m}/${y}`);
      }
    } else {
      setInputValue("");
    }
  }, [value]);

  const handleInputChange = (e) => {
    const rawValue = e.target.value;
    
    // Check if the user is pressing backspace to allow native deletion without slash sticky bug
    if (e.nativeEvent?.inputType === "deleteContentBackward") {
      setInputValue(rawValue);
      // If incomplete, clear the parent calendar selection
      const digitsCleaned = rawValue.replace(/\D/g, '');
      if (digitsCleaned.length < 8) {
        onChange(""); 
      }
      return;
    }

    const digits = rawValue.replace(/\D/g, '');
    let formatted = digits;
    
    // Mask logic
    if (digits.length > 2) {
      formatted = digits.slice(0, 2) + '/' + digits.slice(2);
    }
    if (digits.length > 4) {
      formatted = formatted.slice(0, 5) + '/' + digits.slice(4, 8);
    }
    
    setInputValue(formatted);

    // If fully typed (DD/MM/YYYY), attempt to push to parent
    if (digits.length === 8) {
      const dd = parseInt(digits.slice(0, 2), 10);
      const mm = parseInt(digits.slice(2, 4), 10);
      const yyyy = parseInt(digits.slice(4, 8), 10);
      
      if (dd > 0 && dd <= 31 && mm > 0 && mm <= 12 && yyyy >= 1900 && yyyy <= 2100) {
        // Enforce pad just in case
        onChange(`${yyyy}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`);
      } else {
        onChange(""); // Invalid fully-typed date
      }
    } else {
      onChange(""); // Clear until complete
    }
  };

  return (
    <div className={clsx("relative", className)}>
      <div
        className={clsx(
          "flex h-10 w-full items-center justify-start rounded-md px-3 py-2 text-sm focus-within:ring-2 transition-colors cursor-text group",
          variant === "dark" 
            ? "bg-transparent text-white border-none focus-within:ring-white/50" 
            : "border border-gray-300 bg-white text-gray-900 focus-within:ring-gray-900",
          className
        )}
      >
        {showIcon && (
          <CalendarIcon 
            className={clsx(
              "mr-3 h-5 w-5 shrink-0 transition-opacity", 
              variant === "dark" ? "text-gray-400 group-focus-within:text-white" : "text-gray-500 group-focus-within:text-gray-900"
            )} 
          />
        )}
        <input 
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder || (variant === "dark" ? "DD/MM/YYYY" : "DD / MM / YYYY")}
          className={clsx(
             "w-full bg-transparent outline-none p-0 border-none ring-0",
             (!inputValue && variant === "dark") ? "text-gray-400 placeholder-gray-400" : "",
             (!inputValue && variant === "light") ? "text-gray-500 placeholder-gray-500" : ""
          )}
          maxLength={10}
        />
      </div>
    </div>
  );
}
