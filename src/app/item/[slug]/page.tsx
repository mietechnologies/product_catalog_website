"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/product/Breadcrumbs";
import VariantList from "@/components/item/VariantList";
import VariantDetailPanel from "@/components/item/VariantDetailPanel";
import Skeleton from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { fetchItem } from "@/lib/api/client";
import type { BaseItem } from "@/lib/types";

export default function ItemPage() {
  const params = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [item, setItem] = useState<BaseItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [is404, setIs404] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeVariantSlug, setActiveVariantSlug] = useState<string>("");

  const loadItem = useCallback(() => {
    setIsLoading(true);
    setError(null);

    fetchItem(params.slug).then((result) => {
      if (result.ok) {
        setItem(result.data);
        setActiveVariantSlug((prev) => {
          // Keep current selection if it still exists, otherwise pick first
          const stillExists = result.data.variants.some((v) => v.slug === prev);
          if (stillExists) return prev;
          return result.data.variants.length > 0 ? result.data.variants[0].slug : "";
        });
      } else if (result.status === 404) {
        setIs404(true);
      } else {
        setError(result.error);
        toast(result.error);
      }
      setIsLoading(false);
    });
  }, [params.slug, toast]);

  useEffect(() => {
    loadItem();
  }, [loadItem]);

  if (is404) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full max-w-md" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
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
          <p className="font-medium">Failed to load item</p>
          <p className="mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!item) return null;

  const activeVariant = item.variants.find(
    (v) => v.slug === activeVariantSlug
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Catalog", href: "/" },
          { label: item.name },
        ]}
      />

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
        <p className="text-sm text-neutral mt-1">{item.description}</p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
        {/* Left: variant list (sticky sidebar on desktop) */}
        <div className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
          <VariantList
            variants={item.variants}
            activeSlug={activeVariantSlug}
            onSelect={setActiveVariantSlug}
          />
        </div>

        {/* Right: detail panel */}
        <div>
          {activeVariant ? (
            <VariantDetailPanel
              variant={activeVariant}
              onDataChange={loadItem}
            />
          ) : (
            <p className="text-sm text-neutral">Select a variant to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
}
