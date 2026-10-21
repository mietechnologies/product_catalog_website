"use client";

import { cn } from "@/lib/utils";
import { PRODUCT_TYPES } from "@/lib/types";
import type { ProductType } from "@/lib/types";

interface ProductTypeTabsProps {
  value?: ProductType;
  onChange: (productType: ProductType | undefined) => void;
}

const TABS: { value?: ProductType; label: string }[] = [
  { value: undefined, label: "All" },
  ...PRODUCT_TYPES,
];

export default function ProductTypeTabs({ value, onChange }: ProductTypeTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Product type"
      className="flex gap-1 border-b border-neutral/20"
    >
      {TABS.map((tab) => {
        const selected = tab.value === value;
        return (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.value)}
            className={cn(
              "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              selected
                ? "border-primary text-primary"
                : "border-transparent text-neutral hover:text-neutral-dark hover:border-neutral/40"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
