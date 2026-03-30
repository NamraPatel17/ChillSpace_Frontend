import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";

export function CustomDropdown({ 
  trigger, 
  items, 
  align = "right", 
  className = "",
  onOpenChange
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If trigger was clicked, don't close (let the toggle handler handle it)
      if (triggerRef.current && triggerRef.current.contains(event.target)) return;
      
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("resize", () => setIsOpen(false));
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", () => setIsOpen(false));
    };
  }, [isOpen]);

  useEffect(() => {
    if (onOpenChange) onOpenChange(isOpen);
  }, [isOpen, onOpenChange]);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!isOpen) {
      const rect = triggerRef.current.getBoundingClientRect();
      const isSpaceLimited = (window.innerHeight - rect.bottom) < 200;

      setCoords({
        top: isSpaceLimited ? rect.top + window.scrollY - 8 : rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
        right: rect.right + window.scrollX,
        isDropUp: isSpaceLimited
      });
    }
    setIsOpen(!isOpen);
  };

  const menuStyles = {
    position: "absolute",
    top: `${coords.top}px`,
    ...(align === "right" 
      ? { right: `${window.innerWidth - coords.right}px` } 
      : { left: `${coords.left}px` }
    ),
    transform: coords.isDropUp ? "translateY(-100%)" : "none",
    zIndex: 9999
  };

  return (
    <div className={`relative inline-block ${className}`} ref={triggerRef}>
      <div 
        className="cursor-pointer inline-block" 
        onClick={handleToggle}
      >
        {trigger || (
          <button className="p-2 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm flex items-center justify-center">
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </div>

      {isOpen && createPortal(
        <div 
          ref={dropdownRef}
          style={menuStyles}
          className="w-56 rounded-2xl border border-gray-100 bg-white shadow-2xl py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                if (!item.disabled) {
                  item.onClick();
                  setIsOpen(false);
                }
              }}
              disabled={item.disabled}
              className={`w-full flex items-center px-4 py-3 text-sm transition-all duration-200 group
                ${item.variant === "danger" 
                  ? "text-red-600 hover:bg-red-50" 
                  : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"}
                ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {item.icon && (
                <item.icon className={`mr-3 h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110
                  ${item.variant === "danger" ? "text-red-500" : "text-gray-400 group-hover:text-indigo-500"}
                `} />
              )}
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}
