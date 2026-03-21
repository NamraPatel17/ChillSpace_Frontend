import * as React from "react"

const badgeVariants = {
  default: "bg-gray-900 text-white hover:bg-black",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  outline: "text-gray-950 border border-gray-200 hover:bg-gray-100",
}

function Badge({ className = "", variant = "default", ...props }) {
  const variantClass = badgeVariants[variant] || badgeVariants.default
  
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${variantClass} ${className}`}
      {...props}
    />
  )
}

export { Badge }
