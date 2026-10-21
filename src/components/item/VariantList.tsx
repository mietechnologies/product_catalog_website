"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import type { Product } from "@/lib/types";

interface VariantListProps {
  variants: Product[];
  activeSlug: string;
  onSelect: (slug: string) => void;
}

function VariantThumb({ variant }: { variant: Product }) {
  const [imgError, setImgError] = useState(false);
  const hasRealImage =
    !imgError && variant.images.length > 0 && variant.images[0] !== "";

  return hasRealImage ? (
    <Image
      src={variant.thumbnail ?? variant.images[0]}
      alt={variant.name}
      fill
      className="object-cover"
      sizes="48px"
      onError={() => setImgError(true)}
    />
  ) : (
    <PlaceholderImage
      name={variant.name}
      category={variant.category}
      className="w-full h-full"
      size="sm"
    />
  );
}

export default function VariantList({
  variants,
  activeSlug,
  onSelect,
}: VariantListProps) {
  return (
    <nav aria-label="Product variants">
      <h2 className="text-sm font-semibold text-neutral-dark uppercase tracking-wide mb-3">
        Variants
      </h2>
      <ul className="space-y-2">
        {variants.map((variant) => {
          const isActive = variant.slug === activeSlug;
          return (
            <li key={variant.slug}>
              <button
                onClick={() => onSelect(variant.slug)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
                  isActive
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-neutral/20 bg-white hover:border-neutral/40 hover:bg-neutral/5"
                )}
              >
                {/* Thumbnail */}
                <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border border-neutral/10">
                  <VariantThumb variant={variant} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium truncate",
                      isActive ? "text-primary" : "text-gray-900"
                    )}
                  >
                    {variant.name}
                  </p>
                  <p className="text-xs text-neutral font-mono">
                    {variant.productCode}
                  </p>
                </div>

                {/* Price */}
                <span className="text-sm font-semibold text-primary flex-shrink-0">
                  {formatPrice(variant.price)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
