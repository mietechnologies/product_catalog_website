"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import SearchBar from "@/components/catalog/SearchBar";
import FiltersBar from "@/components/catalog/FiltersBar";
import ProductGrid from "@/components/catalog/ProductGrid";
import { useToast } from "@/components/ui/Toast";
import { fetchCatalog } from "@/lib/api/client";
import type { CatalogEntry, CatalogFilters, SortOption } from "@/lib/types";

function CatalogPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Derive initial filters from URL
  function filtersFromParams(): CatalogFilters {
    return {
      query: searchParams.get("q") ?? undefined,
      creatureType: (searchParams.get("type") ?? undefined) as CatalogFilters["creatureType"],
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

  // Track current filters for retry
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    filters.query ||
    filters.creatureType ||
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
      if (f.creatureType) params.set("type", f.creatureType);
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
    [toast]
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

  function clearFilters() {
    const cleared: CatalogFilters = { sort: filters.sort };
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
        <h1 className="text-2xl font-bold text-gray-900">Miniatures Catalog</h1>
        <p className="text-sm text-neutral mt-1">
          High-quality 3D-printed tabletop miniatures for your next adventure.
        </p>
      </div>

      {/* Search */}
      <SearchBar
        value={filters.query ?? ""}
        onChange={(q) => updateFilters({ query: q || undefined })}
        isLoading={isLoading}
      />

      {/* Filters */}
      <FiltersBar filters={filters} onChange={updateFilters} />

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
