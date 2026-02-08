"use client";

import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

export default function Select({
  options,
  placeholder,
  className,
  ...props
}: SelectProps) {
  return (
    <select
      className={cn(
        "rounded-lg border border-neutral/30 bg-white px-3 py-2 text-sm",
        "hover:border-neutral",
        "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        "transition-colors appearance-none cursor-pointer",
        "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23787878%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_10px_center] bg-no-repeat pr-8",
        className
      )}
      {...props}
    >
      {placeholder && (
        <option value="">{placeholder}</option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
