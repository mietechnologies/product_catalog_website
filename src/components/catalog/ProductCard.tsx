"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { formatPrice, formatPriceRange } from "@/lib/utils";
import type { CatalogEntry } from "@/lib/types";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

interface ProductCardProps {
  entry: CatalogEntry;
}

export default function ProductCard({ entry }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const href =
    entry.type === "item" ? `/item/${entry.slug}` : `/product/${entry.slug}`;

  const priceDisplay = entry.priceRange
    ? formatPriceRange(entry.priceRange.min, entry.priceRange.max)
    : entry.price
      ? formatPrice(entry.price)
      : null;

  const hasRealImage = !imgError && entry.image && entry.image !== "";

  return (
    <Card as="article" className="group">
      <Link
        href={href}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-xl"
        aria-label={`View ${entry.name}`}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-neutral/5">
          {hasRealImage ? (
            <Image
              src={entry.image}
              alt={entry.name}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <PlaceholderImage
              name={entry.name}
              creatureType={entry.creatureType}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-sm leading-tight text-gray-900 group-hover:text-primary transition-colors">
            {entry.name}
          </h3>

          {entry.productCode && (
            <p className="text-xs text-neutral font-mono">{entry.productCode}</p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline">{entry.size}</Badge>
            {entry.hasVariants && (
              <Badge variant="accent">Has Variants</Badge>
            )}
          </div>

          {/* Price */}
          {priceDisplay && (
            <p className="text-sm font-bold text-primary">{priceDisplay}</p>
          )}
        </div>
      </Link>
    </Card>
  );
}
