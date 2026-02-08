"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Breadcrumbs from "@/components/product/Breadcrumbs";
import Gallery from "@/components/product/Gallery";
import PriceBlock from "@/components/product/PriceBlock";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { fetchProduct } from "@/lib/api/client";
import type { BreadcrumbItem } from "@/components/product/Breadcrumbs";
import type { Product } from "@/lib/types";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [is404, setIs404] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchProduct(params.slug).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setProduct(result.data);
      } else if (result.status === 404) {
        setIs404(true);
      } else {
        setError(result.error);
        toast(result.error);
      }
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [params.slug, toast]);

  if (is404) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
        <Skeleton className="h-4 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div
          className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700"
          role="alert"
        >
          <p className="font-medium">Failed to load product</p>
          <p className="mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  // Build breadcrumbs
  const crumbs: BreadcrumbItem[] = [{ label: "Catalog", href: "/" }];
  if (product.parentItemSlug) {
    // Find parent item name from slug
    const parentName = product.parentItemSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    crumbs.push({
      label: parentName,
      href: `/item/${product.parentItemSlug}`,
    });
  }
  crumbs.push({ label: product.name });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={crumbs} />

      {/* Two-column product layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Gallery */}
        <Gallery
          images={product.images}
          name={product.name}
          creatureType={product.creatureType}
        />

        {/* Right: Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-sm text-neutral font-mono mt-1">
              {product.productCode}
            </p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{product.size}</Badge>
            <Badge>{product.creatureType}</Badge>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 leading-relaxed">
            {product.description}
          </p>

          {/* Attributes */}
          {Object.keys(product.attributes).length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-neutral-dark uppercase tracking-wide mb-2">
                Specifications
              </h2>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {Object.entries(product.attributes).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-neutral">{key}</dt>
                    <dd className="font-medium text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Price + purchase placeholder */}
          <PriceBlock price={product.price} />
        </div>
      </div>
    </div>
  );
}
