/**
 * In-memory mock server that simulates REST API behaviour.
 *
 * When you're ready to switch to a real backend:
 *   1. Set NEXT_PUBLIC_API_URL to your server origin.
 *   2. Remove the mock import from client.ts.
 *   3. The rest of the codebase stays the same.
 */

import { baseItems, standaloneProducts } from "@/data/seed";
import type {
  BaseItem,
  CatalogEntry,
  CatalogFilters,
  CatalogResponse,
  Product,
  ProductMeta,
  SortOption,
} from "@/lib/types";

// Simulated network latency (ms)
const MOCK_DELAY_MIN = 200;
const MOCK_DELAY_MAX = 600;

function delay(): Promise<void> {
  const ms =
    Math.floor(Math.random() * (MOCK_DELAY_MAX - MOCK_DELAY_MIN)) +
    MOCK_DELAY_MIN;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Build flat catalog from seed data ────────────────────────────────

function buildCatalogEntries(): CatalogEntry[] {
  const entries: CatalogEntry[] = [];

  for (const item of baseItems) {
    entries.push({
      slug: item.slug,
      name: item.name,
      productCode: item.productCode,
      image: item.image,
      priceRange: item.priceRange,
      productType: item.productType,
      category: item.category,
      collections: item.collections,
      size: item.size,
      creatureType: item.creatureType,
      hasVariants: true,
      type: "item",
    });
  }

  for (const product of standaloneProducts) {
    entries.push({
      slug: product.slug,
      name: product.name,
      productCode: product.productCode,
      image: product.images[0] ?? "",
      price: product.price,
      productType: product.productType,
      category: product.category,
      collections: product.collections,
      size: product.size,
      creatureType: product.creatureType,
      hasVariants: false,
      type: "product",
    });
  }

  return entries;
}

const allEntries = buildCatalogEntries();

// ── Helpers ──────────────────────────────────────────────────────────

function matchesQuery(entry: CatalogEntry, query: string): boolean {
  const q = query.toLowerCase();
  return (
    entry.name.toLowerCase().includes(q) ||
    (entry.productCode?.toLowerCase().includes(q) ?? false) ||
    entry.category.toLowerCase().includes(q) ||
    entry.collections.some((c) => c.toLowerCase().includes(q))
  );
}

function getEffectivePrice(entry: CatalogEntry): number {
  return entry.price ?? entry.priceRange?.min ?? 0;
}

function sortEntries(entries: CatalogEntry[], sort: SortOption): CatalogEntry[] {
  const sorted = [...entries];
  switch (sort) {
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "price-low":
      return sorted.sort(
        (a, b) => getEffectivePrice(a) - getEffectivePrice(b)
      );
    case "price-high":
      return sorted.sort(
        (a, b) => getEffectivePrice(b) - getEffectivePrice(a)
      );
    default:
      return sorted;
  }
}

// ── Public API handlers ──────────────────────────────────────────────

export async function getCatalog(
  filters: CatalogFilters
): Promise<CatalogResponse> {
  await delay();

  let results = [...allEntries];

  // Text search
  if (filters.query) {
    results = results.filter((e) => matchesQuery(e, filters.query!));
  }

  // Product type tab
  if (filters.productType) {
    results = results.filter((e) => e.productType === filters.productType);
  }

  // Category filter (creature type or print category)
  if (filters.category) {
    results = results.filter((e) => e.category === filters.category);
  }

  // Collection filter
  if (filters.collection) {
    const c = filters.collection.toLowerCase();
    results = results.filter((e) =>
      e.collections.some((x) => x.toLowerCase() === c)
    );
  }

  // Size filter
  if (filters.size) {
    results = results.filter((e) => e.size === filters.size);
  }

  // Has variants toggle
  if (filters.hasVariants !== undefined) {
    results = results.filter((e) => e.hasVariants === filters.hasVariants);
  }

  // Price range
  if (filters.priceMin !== undefined) {
    results = results.filter((e) => getEffectivePrice(e) >= filters.priceMin!);
  }
  if (filters.priceMax !== undefined) {
    results = results.filter((e) => getEffectivePrice(e) <= filters.priceMax!);
  }

  // Sort
  if (filters.sort) {
    results = sortEntries(results, filters.sort);
  }

  return { entries: results, total: results.length };
}

export async function getItem(slug: string): Promise<BaseItem | null> {
  await delay();
  return baseItems.find((item) => item.slug === slug) ?? null;
}

export async function getProduct(slug: string): Promise<Product | null> {
  await delay();

  // Check standalone products
  const standalone = standaloneProducts.find((p) => p.slug === slug);
  if (standalone) return standalone;

  // Check variants across all base items
  for (const item of baseItems) {
    const variant = item.variants.find((v) => v.slug === slug);
    // Variants inherit the base item's attribution, matching the live API
    if (variant) return { ...variant, attribution: variant.attribution ?? item.attribution };
  }

  return null;
}

export async function getProductMeta(): Promise<ProductMeta> {
  await delay();
  const collections = new Set(allEntries.flatMap((e) => e.collections));
  return { collections: [...collections].sort() };
}
