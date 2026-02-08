"use client";

import ProductCard from "./ProductCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import type { CatalogEntry } from "@/lib/types";

interface ProductGridProps {
  entries: CatalogEntry[];
  isLoading: boolean;
  hasError?: boolean;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  onRetry?: () => void;
}

export default function ProductGrid({
  entries,
  isLoading,
  hasError,
  hasActiveFilters,
  onClearFilters,
  onRetry,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        aria-label="Loading catalog"
        role="status"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Error state — the catalog failed to load entirely
  if (hasError && entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        {/* Warning icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-5">
          <svg
            className="h-8 w-8 text-red-400"
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
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Unable to load catalog
        </h3>
        <p className="text-sm text-neutral max-w-xs mb-6">
          We couldn&apos;t fetch the miniatures right now. This might be a
          connection issue with the server.
        </p>
        {onRetry && (
          <Button variant="primary" onClick={onRetry}>
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"
              />
            </svg>
            Try again
          </Button>
        )}
      </div>
    );
  }

  // Empty state — no results after filtering or the catalog is genuinely empty
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        {hasActiveFilters ? (
          <>
            {/* Search/filter empty */}
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-neutral/10 mb-5">
              <svg
                className="h-8 w-8 text-neutral/50"
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
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No miniatures found
            </h3>
            <p className="text-sm text-neutral max-w-xs mb-6">
              No results match your current search and filters.
              Try broadening your criteria.
            </p>
            {onClearFilters && (
              <Button variant="ghost" onClick={onClearFilters}>
                Clear all filters
              </Button>
            )}
          </>
        ) : (
          <>
            {/* Completely empty catalog */}
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/5 mb-5">
              <svg
                className="h-10 w-10 text-primary/40"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              The catalog is empty
            </h3>
            <p className="text-sm text-neutral max-w-xs">
              There are no miniatures in the catalog yet.
              Check back soon — new models are added regularly.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      role="list"
      aria-label="Product catalog"
    >
      {entries.map((entry) => (
        <div key={entry.slug} role="listitem">
          <ProductCard entry={entry} />
        </div>
      ))}
    </div>
  );
}
