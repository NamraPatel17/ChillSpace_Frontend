import React from "react";
import clsx from "clsx";

export const Checkbox = ({
  checked,
  onCheckedChange,
  className = "",
  ...props
}) => {
  return (
    <input
      type="checkbox"
      checked={!!checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={clsx(
        "h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900",
        className
      )}
      {...props}
    />
  );
};

