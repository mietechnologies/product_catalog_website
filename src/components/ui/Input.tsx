"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-neutral/30 bg-white px-3 py-2 text-sm",
          "placeholder:text-neutral-light",
          "hover:border-neutral",
          "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
          "disabled:pointer-events-none disabled:opacity-50",
          "transition-colors",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
