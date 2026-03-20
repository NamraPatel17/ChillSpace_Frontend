import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import clsx from "clsx";

export function DatePicker({ value, onChange, placeholder, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Safely parse string value "YYYY-MM-DD" back to local date without timezone offset shifting it back a day
  const dateObj = value ? new Date(value + "T12:00:00") : undefined;

  return (
    <div className={clsx("relative", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex h-10 w-full items-center justify-start rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors",
          !value && "text-gray-500"
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
        <span className="truncate">
          {value ? format(dateObj, "MMM d, yyyy") : placeholder}
        </span>
      </button>
      
      {isOpen && (
        <div className="absolute top-12 left-0 z-50 rounded-md border bg-white p-3 shadow-xl" style={{ width: 'max-content' }}>
          <DayPicker
            mode="single"
            selected={dateObj}
            onSelect={(d) => {
              if (d) {
                // Return explicitly formatted string "YYYY-MM-DD" matching HTML5 date input outputs
                onChange(format(d, "yyyy-MM-dd"));
                setIsOpen(false);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
