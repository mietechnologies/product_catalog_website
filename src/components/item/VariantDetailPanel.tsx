"use client";

import { useState } from "react";
import Link from "next/link";
import Gallery from "@/components/product/Gallery";
import PriceBlock from "@/components/product/PriceBlock";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthContext";
import ImageUpload from "@/components/admin/ImageUpload";
import EditVariantModal from "@/components/admin/EditVariantModal";
import type { Product } from "@/lib/types";

interface VariantDetailPanelProps {
  variant: Product;
  onDataChange?: () => void;
}

export default function VariantDetailPanel({ variant, onDataChange }: VariantDetailPanelProps) {
  const { auth } = useAuth();
  const [editOpen, setEditOpen] = useState(false);

  // Extract price numbers from attributes for the edit modal
  const costStr = variant.attributes["Print Cost"];
  const wholesaleStr = variant.attributes["Wholesale"];
  const costNum = costStr ? parseFloat(costStr.replace("$", "")) : 0;
  const wholesaleNum = wholesaleStr ? parseFloat(wholesaleStr.replace("$", "")) : 0;

  return (
    <div className="space-y-6">
      {/* Gallery */}
      <Gallery
        images={variant.images}
        name={variant.name}
        category={variant.category}
      />

      {/* Admin: Upload Photos */}
      {auth?.user.role === "admin" && onDataChange && (
        <ImageUpload productCode={variant.productCode} onSuccess={onDataChange} />
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">{variant.name}</h2>
        <p className="text-sm text-neutral font-mono mt-1">{variant.productCode}</p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {variant.size && <Badge variant="outline">{variant.size}</Badge>}
        <Badge>{variant.category}</Badge>
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

      {/* Admin: Edit Details */}
      {auth?.user.role === "admin" && onDataChange && (
        <>
          <Button variant="ghost" onClick={() => setEditOpen(true)}>
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
            Edit Details
          </Button>

          <EditVariantModal
            open={editOpen}
            onClose={() => setEditOpen(false)}
            productCode={variant.productCode}
            initial={{
              name: variant.name,
              description: variant.description,
              size: variant.size,
              cost: costNum,
              wholesale: wholesaleNum,
              msrp: variant.price,
              attribution: variant.attribution,
            }}
            onSuccess={onDataChange}
          />
        </>
      )}
    </div>
  );
}
