"use client";

import Select from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import { CREATURE_TYPES, PRODUCT_SIZES } from "@/lib/types";
import type { CatalogFilters, SortOption } from "@/lib/types";

const PRICE_PRESETS = [
  { label: "Under $10", min: 0, max: 10 },
  { label: "$10 – $25", min: 10, max: 25 },
  { label: "$25 – $50", min: 25, max: 50 },
  { label: "$50+", min: 50, max: undefined },
];

interface FiltersBarProps {
  filters: CatalogFilters;
  onChange: (filters: Partial<CatalogFilters>) => void;
}

export default function FiltersBar({ filters, onChange }: FiltersBarProps) {
  const activePricePreset = PRICE_PRESETS.findIndex(
    (p) =>
      p.min === filters.priceMin &&
      (p.max === undefined
        ? filters.priceMax === undefined
        : p.max === filters.priceMax)
  );

  function togglePricePreset(idx: number) {
    if (idx === activePricePreset) {
      onChange({ priceMin: undefined, priceMax: undefined });
    } else {
      const preset = PRICE_PRESETS[idx];
      onChange({ priceMin: preset.min, priceMax: preset.max });
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Creature type */}
        <Select
          aria-label="Filter by creature type"
          placeholder="All Creature Types"
          value={filters.creatureType ?? ""}
          onChange={(e) =>
            onChange({
              creatureType: (e.target.value || undefined) as CatalogFilters["creatureType"],
            })
          }
          options={CREATURE_TYPES.map((t) => ({ value: t, label: t }))}
        />

        {/* Size */}
        <Select
          aria-label="Filter by size"
          placeholder="All Sizes"
          value={filters.size ?? ""}
          onChange={(e) =>
            onChange({
              size: (e.target.value || undefined) as CatalogFilters["size"],
            })
          }
          options={PRODUCT_SIZES.map((s) => ({ value: s, label: s }))}
        />

        {/* Has Variants toggle */}
        <button
          type="button"
          role="switch"
          aria-checked={filters.hasVariants === true}
          aria-label="Show only items with variants"
          onClick={() =>
            onChange({
              hasVariants:
                filters.hasVariants === true ? undefined : true,
            })
          }
          className={cn(
            "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
            filters.hasVariants === true
              ? "border-accent bg-accent/10 text-accent-dark"
              : "border-neutral/30 bg-white text-neutral-dark hover:border-neutral"
          )}
        >
          <span
            className={cn(
              "inline-block h-3 w-3 rounded-full transition-colors",
              filters.hasVariants === true ? "bg-accent" : "bg-neutral/30"
            )}
          />
          Has Variants
        </button>

        {/* Sort */}
        <div className="ml-auto">
          <Select
            aria-label="Sort results"
            value={filters.sort ?? ""}
            onChange={(e) =>
              onChange({
                sort: (e.target.value || undefined) as SortOption | undefined,
              })
            }
            placeholder="Sort by..."
            options={[
              { value: "name-asc", label: "Name A–Z" },
              { value: "price-low", label: "Price: Low to High" },
              { value: "price-high", label: "Price: High to Low" },
            ]}
          />
        </div>
      </div>

      {/* Price preset chips */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Price range filters">
        {PRICE_PRESETS.map((preset, idx) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => togglePricePreset(idx)}
            aria-pressed={idx === activePricePreset}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              idx === activePricePreset
                ? "border-primary bg-primary text-white"
                : "border-neutral/30 bg-white text-neutral-dark hover:border-neutral hover:bg-neutral/5"
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
