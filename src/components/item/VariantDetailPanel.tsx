"use client";

import Link from "next/link";
import Gallery from "@/components/product/Gallery";
import PriceBlock from "@/components/product/PriceBlock";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { Product } from "@/lib/types";

interface VariantDetailPanelProps {
  variant: Product;
}

export default function VariantDetailPanel({ variant }: VariantDetailPanelProps) {
  return (
    <div className="space-y-6">
      {/* Gallery */}
      <Gallery
        images={variant.images}
        name={variant.name}
        creatureType={variant.creatureType}
      />

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">{variant.name}</h2>
        <p className="text-sm text-neutral font-mono mt-1">{variant.productCode}</p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">{variant.size}</Badge>
        <Badge>{variant.creatureType}</Badge>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 leading-relaxed">{variant.description}</p>

      {/* Attributes */}
      {Object.keys(variant.attributes).length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-neutral-dark uppercase tracking-wide mb-2">
            Specifications
          </h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {Object.entries(variant.attributes).map(([key, value]) => (
              <div key={key}>
                <dt className="text-neutral">{key}</dt>
                <dd className="font-medium text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Price */}
      <PriceBlock price={variant.price} />

      {/* Link to dedicated product page */}
      <Link href={`/product/${variant.slug}`}>
        <Button variant="ghost" className="w-full mt-2">
          View full product page
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Button>
      </Link>
    </div>
  );
}
