import React from "react";
import clsx from "clsx";

export const Separator = ({ className = "", ...props }) => {
  return <hr className={clsx("border-gray-200", className)} {...props} />;
};

