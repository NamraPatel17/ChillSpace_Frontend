import React from "react";
import clsx from "clsx";

export const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={clsx(
        "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400",
        "focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-blue-500",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
};

