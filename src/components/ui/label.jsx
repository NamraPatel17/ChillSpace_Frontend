import React from "react";
import clsx from "clsx";

export const Label = ({ className = "", ...props }) => {
  return (
    <label
      className={clsx("text-sm font-medium text-gray-700", className)}
      {...props}
    />
  );
};

