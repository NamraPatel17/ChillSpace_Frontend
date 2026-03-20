import React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import clsx from "clsx"

const Slider = React.forwardRef(({ className, ...props }, ref) => {
  // Determine if it's a single or dual-range slider based on value array
  const values = props.value || props.defaultValue || [0]

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={clsx("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-blue-100">
        <SliderPrimitive.Range className="absolute h-full bg-blue-600" />
      </SliderPrimitive.Track>
      
      {values.map((_, i) => (
        <SliderPrimitive.Thumb 
          key={i} 
          className="block h-5 w-5 rounded-full border-2 border-blue-600 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:cursor-grab" 
        />
      ))}
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
