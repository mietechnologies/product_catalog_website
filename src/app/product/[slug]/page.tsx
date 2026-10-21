"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Breadcrumbs from "@/components/product/Breadcrumbs";
import Gallery from "@/components/product/Gallery";
import PriceBlock from "@/components/product/PriceBlock";
import AttributionCredit from "@/components/product/AttributionCredit";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchProduct } from "@/lib/api/client";
import ImageUpload from "@/components/admin/ImageUpload";
import EditVariantModal from "@/components/admin/EditVariantModal";
import AddVariantModal from "@/components/admin/AddVariantModal";
import type { BreadcrumbItem } from "@/components/product/Breadcrumbs";
import type { Product } from "@/lib/types";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const { toast } = useToast();
  const { auth } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [is404, setIs404] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const loadProduct = useCallback(() => {
    setIsLoading(true);
    setError(null);

    fetchProduct(params.slug, auth?.token).then((result) => {
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
  }, [params.slug, auth?.token, toast]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

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

  // Extract price numbers from attributes for the edit modal
  const costStr = product.attributes["Print Cost"];
  const wholesaleStr = product.attributes["Wholesale"];
  const costNum = costStr ? parseFloat(costStr.replace("$", "")) : 0;
  const wholesaleNum = wholesaleStr ? parseFloat(wholesaleStr.replace("$", "")) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={crumbs} />

      {/* Two-column product layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Gallery */}
        <div className="space-y-3">
          <Gallery
            images={product.images}
            name={product.name}
            creatureType={product.creatureType}
          />

          {/* Admin: Upload Photos */}
          {auth?.user.accountType === "admin" && (
            <ImageUpload productCode={product.productCode} onSuccess={loadProduct} />
          )}
        </div>

        {/* Right: Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-sm text-neutral font-mono mt-1">
              {product.productCode}
            </p>
            <AttributionCredit attribution={product.attribution} className="mt-2" />
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

          {/* Admin: Edit Details + Add Variant */}
          {auth?.user.accountType === "admin" && (
            <div className="flex gap-2">
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
              <Button variant="ghost" onClick={() => setAddOpen(true)}>
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
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Add Variant
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Edit modal */}
      {auth?.user.accountType === "admin" && (
        <EditVariantModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          productCode={product.productCode}
          initial={{
            name: product.name,
            description: product.description,
            size: product.size,
            cost: costNum,
            wholesale: wholesaleNum,
            msrp: product.price,
            attribution: product.attribution,
          }}
          onSuccess={loadProduct}
        />
      )}

      {/* Add variant modal */}
      {auth?.user.accountType === "admin" && (
        <AddVariantModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          productCode={product.productCode}
          onSuccess={loadProduct}
        />
      )}
    </div>
  );
}
