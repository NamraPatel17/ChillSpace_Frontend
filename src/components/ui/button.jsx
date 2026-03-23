import React from "react";
import clsx from "clsx";

export const Button = ({
  children,
  className = "",
  variant = "default",
  size = "md",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    default: "bg-gray-900 text-white hover:bg-black",
    outline:
      "border border-gray-300 text-gray-900 bg-white hover:bg-gray-50",
    destructive:
      "bg-red-600 text-white hover:bg-red-700"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base"
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

