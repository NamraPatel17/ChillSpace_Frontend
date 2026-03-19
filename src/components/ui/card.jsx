import React from "react";
import clsx from "clsx";

export const Card = ({ className = "", children, ...props }) => {
  return (
    <div
      className={clsx("bg-white rounded-xl border border-gray-200", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ className = "", children, ...props }) => {
  return (
    <div className={clsx("p-4", className)} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ className = "", children, ...props }) => {
  return (
    <div className={clsx("flex flex-col space-y-1.5 p-6", className)} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ className = "", children, ...props }) => {
  return (
    <h3 className={clsx("font-semibold leading-none tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
};

