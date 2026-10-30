"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import SearchBar from "@/components/catalog/SearchBar";
import FiltersBar from "@/components/catalog/FiltersBar";
import ProductGrid from "@/components/catalog/ProductGrid";
import ProductTypeTabs from "@/components/catalog/ProductTypeTabs";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchCatalog, fetchProductMeta } from "@/lib/api/client";
import { PRODUCT_TYPES } from "@/lib/types";
import type { CatalogEntry, CatalogFilters, ProductType, SortOption } from "@/lib/types";

function CatalogPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { auth } = useAuth();

  // Derive initial filters from URL
  function filtersFromParams(): CatalogFilters {
    const tab = searchParams.get("tab");
    return {
      query: searchParams.get("q") ?? undefined,
      productType: PRODUCT_TYPES.some((t) => t.value === tab)
        ? (tab as ProductType)
        : undefined,
      category: searchParams.get("category") ?? undefined,
      collection: searchParams.get("collection") ?? undefined,
      size: (searchParams.get("size") ?? undefined) as CatalogFilters["size"],
      hasVariants:
        searchParams.get("variants") === "true"
          ? true
          : undefined,
      priceMin: searchParams.get("pmin")
        ? Number(searchParams.get("pmin"))
        : undefined,
      priceMax: searchParams.get("pmax")
        ? Number(searchParams.get("pmax"))
        : undefined,
      sort: (searchParams.get("sort") ?? undefined) as SortOption | undefined,
    };
  }

  const [filters, setFilters] = useState<CatalogFilters>(filtersFromParams);
  const [entries, setEntries] = useState<CatalogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [collections, setCollections] = useState<string[]>([]);

  // Load the collections in use for the collection filter
  useEffect(() => {
    fetchProductMeta().then((result) => {
      if (result.ok) setCollections(result.data.collections);
    });
  }, []);

  // Track current filters for retry
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    filters.query ||
    filters.category ||
    filters.collection ||
    filters.size ||
    filters.hasVariants !== undefined ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined
  );

  // Sync filters -> URL
  const pushFiltersToUrl = useCallback(
    (f: CatalogFilters) => {
      const params = new URLSearchParams();
      if (f.query) params.set("q", f.query);
      if (f.productType) params.set("tab", f.productType);
      if (f.category) params.set("category", f.category);
      if (f.collection) params.set("collection", f.collection);
      if (f.size) params.set("size", f.size);
      if (f.hasVariants) params.set("variants", "true");
      if (f.priceMin !== undefined) params.set("pmin", String(f.priceMin));
      if (f.priceMax !== undefined) params.set("pmax", String(f.priceMax));
      if (f.sort) params.set("sort", f.sort);
      const qs = params.toString();
      router.replace(qs ? `/?${qs}` : "/", { scroll: false });
    },
    [router]
  );

  // Core fetch logic (shared between initial load and retry)
  const loadCatalog = useCallback(
    (currentFilters: CatalogFilters) => {
      setIsLoading(true);
      setHasError(false);

      fetchCatalog(currentFilters).then((result) => {
        if (result.ok) {
          setEntries(result.data.entries);
        } else {
          setHasError(true);
          setEntries([]);
          toast(result.error);
        }
        setIsLoading(false);
      });
    },
    [auth?.user.id, toast]
  );

  // Fetch data whenever filters change
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);

    fetchCatalog(filters).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setEntries(result.data.entries);
      } else {
        setHasError(true);
        setEntries([]);
        toast(result.error);
      }
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [filters, toast]);

  function updateFilters(partial: Partial<CatalogFilters>) {
    const next = { ...filters, ...partial };
    setFilters(next);
    pushFiltersToUrl(next);
  }

  function changeTab(productType: ProductType | undefined) {
    // Categories, sizes, and variants differ by type, so reset them with the tab
    updateFilters({
      productType,
      category: undefined,
      size: undefined,
      hasVariants: undefined,
    });
  }

  function clearFilters() {
    const cleared: CatalogFilters = { sort: filters.sort, productType: filters.productType };
    setFilters(cleared);
    pushFiltersToUrl(cleared);
  }

  function retry() {
    loadCatalog(filtersRef.current);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
        <p className="text-sm text-neutral mt-1">
          High-quality 3D prints, from tabletop miniatures to figurines, toys, and decor.
        </p>
      </div>

      {/* Product type tabs */}
      <ProductTypeTabs value={filters.productType} onChange={changeTab} />

      {/* Search */}
      <SearchBar
        value={filters.query ?? ""}
        onChange={(q) => updateFilters({ query: q || undefined })}
        isLoading={isLoading}
      />

      {/* Filters */}
      <FiltersBar
        filters={filters}
        onChange={updateFilters}
        collections={collections}
      />

      {/* Results */}
      <ProductGrid
        entries={entries}
        isLoading={isLoading}
        hasError={hasError}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        onRetry={retry}
      />

      {/* Result count */}
      {!isLoading && !hasError && entries.length > 0 && (
        <p className="text-xs text-neutral text-center pt-4">
          Showing {entries.length} {entries.length === 1 ? "result" : "results"}
        </p>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense>
      <CatalogPageInner />
    </Suspense>
  );
}
