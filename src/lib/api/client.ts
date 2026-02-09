/**
 * API client — single entry-point the UI uses for all data fetching.
 *
 * When NEXT_PUBLIC_API_URL is set, hits the real backend and transforms
 * responses into frontend types. Otherwise falls back to the mock server.
 *
 * The backend now supports:
 *  - Server-side filters on GET /api/miniatures (category, size, hasVariants, minPrice, maxPrice)
 *  - Full-text search on GET /api/miniatures/search?q=
 */

import type {
  AddVariantPayload,
  ApiResult,
  BackendCatalogResponse,
  BackendMiniatureItem,
  BaseItem,
  CatalogEntry,
  CatalogFilters,
  CatalogResponse,
  CreateMiniaturePayload,
  CreatureType,
  Product,
  ProductSize,
  SortOption,
  UpdateVariantPayload,
} from "@/lib/types";
import { endpoints, BASE_URL, API_KEY } from "./endpoints";
import * as mock from "./mockServer";

const USE_LIVE_API = Boolean(BASE_URL);

// ── Generic fetch helper ─────────────────────────────────────────────

async function fetchJson<T>(
  url: string,
  init?: RequestInit
): Promise<ApiResult<T>> {
  try {
    const headers: Record<string, string> = {
      ...(init?.headers as Record<string, string>),
    };
    if (API_KEY) {
      headers["x-api-key"] = API_KEY;
    }

    const res = await fetch(url, { ...init, headers });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return {
        ok: false,
        error: body?.message ?? res.statusText,
        status: res.status,
      };
    }
    const data: T = await res.json();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: (err as Error).message, status: 0 };
  }
}

// ── Backend → Frontend transforms ────────────────────────────────────

/** Derive a URL-safe slug from a base name (e.g. "Silver Dragon" → "silver-dragon") */
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Parse "BaseName, VariantName" into parts */
function parseBackendName(name: string): {
  baseName: string;
  variantName: string;
} {
  const commaIdx = name.indexOf(",");
  if (commaIdx === -1) {
    return { baseName: name.trim(), variantName: "" };
  }
  return {
    baseName: name.slice(0, commaIdx).trim(),
    variantName: name.slice(commaIdx + 1).trim(),
  };
}

/** Convert backend images map { "0": url, "1": url } to ordered array */
function imagesMapToArray(images: Record<string, string>): string[] {
  return Object.keys(images)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => images[k]);
}

/** Convert a backend item to a frontend Product */
function backendToProduct(
  item: BackendMiniatureItem,
  parentItemSlug?: string
): Product {
  const imageArray = imagesMapToArray(item.images);
  return {
    slug: item.productCode,
    name: item.name,
    productCode: item.productCode,
    price: item.msrp,
    description: item.description ?? "",
    images: imageArray,
    thumbnail: item.thumbnail,
    size: item.size as ProductSize,
    creatureType: item.category as CreatureType,
    attributes: {
      Size: item.size,
      Category: item.category,
      ...(item.cost ? { "Print Cost": `$${item.cost.toFixed(2)}` } : {}),
      ...(item.wholesale
        ? { Wholesale: `$${item.wholesale.toFixed(2)}` }
        : {}),
    },
    parentItemSlug,
  };
}

/** Get the first available image URL for display, or empty string */
function primaryImage(item: BackendMiniatureItem): string {
  if (item.thumbnail) return item.thumbnail;
  const urls = imagesMapToArray(item.images);
  return urls[0] ?? "";
}

/**
 * Group a flat list of backend items by base name.
 * Returns Map<baseName, BackendMiniatureItem[]>.
 */
function groupByBaseName(
  items: BackendMiniatureItem[]
): Map<string, BackendMiniatureItem[]> {
  const groups = new Map<string, BackendMiniatureItem[]>();
  for (const item of items) {
    const { baseName } = parseBackendName(item.name);
    const existing = groups.get(baseName) ?? [];
    existing.push(item);
    groups.set(baseName, existing);
  }
  return groups;
}

/**
 * Convert grouped backend items into CatalogEntry[].
 *  - Groups with 1 item → standalone product, type "product", slug = productCode
 *  - Groups with 2+ items → base item, type "item", slug = slugified base name
 */
function groupsToCatalogEntries(
  groups: Map<string, BackendMiniatureItem[]>
): CatalogEntry[] {
  const entries: CatalogEntry[] = [];

  for (const [baseName, variants] of groups) {
    if (variants.length === 1) {
      const item = variants[0];
      entries.push({
        slug: item.productCode,
        name: item.name,
        productCode: item.productCode,
        image: primaryImage(item),
        price: item.msrp,
        size: item.size as ProductSize,
        creatureType: item.category as CreatureType,
        hasVariants: false,
        type: "product",
      });
    } else {
      const prices = variants.map((v) => v.msrp).filter((p) => p > 0);
      const representative = variants[0];
      entries.push({
        slug: toSlug(baseName),
        name: baseName,
        image: primaryImage(representative),
        priceRange:
          prices.length > 0
            ? { min: Math.min(...prices), max: Math.max(...prices) }
            : undefined,
        size: representative.size as ProductSize,
        creatureType: representative.category as CreatureType,
        hasVariants: true,
        type: "item",
      });
    }
  }

  return entries;
}

// ── Build query strings for backend endpoints ────────────────────────

/**
 * Build query params for GET /api/miniatures from frontend filters.
 * Passes category, size, hasVariants, minPrice, maxPrice to the backend.
 */
function buildListParams(filters: CatalogFilters): URLSearchParams {
  const params = new URLSearchParams();
  params.set("limit", "1000");
  if (filters.creatureType) params.set("category", filters.creatureType);
  if (filters.size) params.set("size", filters.size);
  if (filters.hasVariants === true) params.set("hasVariants", "true");
  if (filters.priceMin !== undefined)
    params.set("minPrice", String(filters.priceMin));
  if (filters.priceMax !== undefined)
    params.set("maxPrice", String(filters.priceMax));
  return params;
}

/**
 * Build query params for GET /api/miniatures/search.
 */
function buildSearchParams(
  query: string,
  filters: CatalogFilters
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("q", query);
  params.set("limit", "1000");
  // The search endpoint doesn't accept filter params,
  // so remaining filters are applied client-side after grouping.
  return params;
}

// ── Client-side post-processing ──────────────────────────────────────

function getEffectivePrice(entry: CatalogEntry): number {
  return entry.price ?? entry.priceRange?.min ?? 0;
}

function sortEntries(
  entries: CatalogEntry[],
  sort: SortOption
): CatalogEntry[] {
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

/**
 * Apply filters that couldn't be handled server-side.
 * For the list endpoint: only sort remains (backend handles the rest).
 * For the search endpoint: category, size, hasVariants, price, and sort.
 */
function applyRemainingFilters(
  entries: CatalogEntry[],
  filters: CatalogFilters,
  searchMode: boolean
): CatalogEntry[] {
  let result = [...entries];

  if (searchMode) {
    // Search endpoint doesn't support these filters, apply client-side
    if (filters.creatureType) {
      result = result.filter((e) => e.creatureType === filters.creatureType);
    }
    if (filters.size) {
      result = result.filter((e) => e.size === filters.size);
    }
    if (filters.hasVariants !== undefined) {
      result = result.filter((e) => e.hasVariants === filters.hasVariants);
    }
    if (filters.priceMin !== undefined) {
      result = result.filter(
        (e) => getEffectivePrice(e) >= filters.priceMin!
      );
    }
    if (filters.priceMax !== undefined) {
      result = result.filter(
        (e) => getEffectivePrice(e) <= filters.priceMax!
      );
    }
  }

  // Sort is always client-side (backend doesn't support it)
  if (filters.sort) {
    result = sortEntries(result, filters.sort);
  }

  return result;
}

// ── Mock-only client-side filtering (all filters applied locally) ────

function matchesQuery(entry: CatalogEntry, query: string): boolean {
  const q = query.toLowerCase();
  return (
    entry.name.toLowerCase().includes(q) ||
    (entry.productCode?.toLowerCase().includes(q) ?? false) ||
    entry.creatureType.toLowerCase().includes(q)
  );
}

function applyAllFiltersMock(
  entries: CatalogEntry[],
  filters: CatalogFilters
): CatalogEntry[] {
  let result = [...entries];

  if (filters.query) {
    result = result.filter((e) => matchesQuery(e, filters.query!));
  }
  if (filters.creatureType) {
    result = result.filter((e) => e.creatureType === filters.creatureType);
  }
  if (filters.size) {
    result = result.filter((e) => e.size === filters.size);
  }
  if (filters.hasVariants !== undefined) {
    result = result.filter((e) => e.hasVariants === filters.hasVariants);
  }
  if (filters.priceMin !== undefined) {
    result = result.filter((e) => getEffectivePrice(e) >= filters.priceMin!);
  }
  if (filters.priceMax !== undefined) {
    result = result.filter((e) => getEffectivePrice(e) <= filters.priceMax!);
  }
  if (filters.sort) {
    result = sortEntries(result, filters.sort);
  }

  return result;
}

// ── Public API ───────────────────────────────────────────────────────

/** Fetch catalog entries with optional filters */
export async function fetchCatalog(
  filters: CatalogFilters
): Promise<ApiResult<CatalogResponse>> {
  if (!USE_LIVE_API) {
    try {
      const data = await mock.getCatalog(filters);
      return { ok: true, data };
    } catch (err) {
      return { ok: false, error: (err as Error).message, status: 500 };
    }
  }

  const hasSearchQuery = Boolean(filters.query?.trim());

  let result: ApiResult<BackendCatalogResponse>;

  if (hasSearchQuery) {
    // Use the full-text search endpoint (relevance-ranked results)
    const params = buildSearchParams(filters.query!, filters);
    result = await fetchJson<BackendCatalogResponse>(
      `${endpoints.search()}?${params}`
    );
  } else {
    // Use the list endpoint with server-side filters
    const params = buildListParams(filters);
    result = await fetchJson<BackendCatalogResponse>(
      `${endpoints.miniatures()}?${params}`
    );
  }

  if (!result.ok) return result;

  const groups = groupByBaseName(result.data.items);
  const allEntries = groupsToCatalogEntries(groups);
  const filtered = applyRemainingFilters(allEntries, filters, hasSearchQuery);

  return {
    ok: true,
    data: { entries: filtered, total: filtered.length },
  };
}

/** Fetch a base item with its variants by slug (slugified base name) */
export async function fetchItem(
  slug: string
): Promise<ApiResult<BaseItem>> {
  if (!USE_LIVE_API) {
    try {
      const data = await mock.getItem(slug);
      if (!data) return { ok: false, error: "Item not found", status: 404 };
      return { ok: true, data };
    } catch (err) {
      return { ok: false, error: (err as Error).message, status: 500 };
    }
  }

  // Fetch all items and find the group matching this slug
  const result = await fetchJson<BackendCatalogResponse>(
    `${endpoints.miniatures()}?limit=1000`
  );
  if (!result.ok) return result;

  const groups = groupByBaseName(result.data.items);

  // Find the group whose slugified base name matches
  for (const [baseName, variants] of groups) {
    if (toSlug(baseName) === slug) {
      const itemSlug = toSlug(baseName);
      const prices = variants.map((v) => v.msrp).filter((p) => p > 0);
      const representative = variants[0];

      const baseItem: BaseItem = {
        slug: itemSlug,
        name: baseName,
        description:
          representative.description ??
          `${baseName} — available in ${variants.length} variant${variants.length > 1 ? "s" : ""}.`,
        image: primaryImage(representative),
        creatureType: representative.category as CreatureType,
        size: representative.size as ProductSize,
        hasVariants: variants.length > 1,
        variants: variants.map((v) => backendToProduct(v, itemSlug)),
        priceRange:
          prices.length > 0
            ? { min: Math.min(...prices), max: Math.max(...prices) }
            : undefined,
      };

      return { ok: true, data: baseItem };
    }
  }

  return { ok: false, error: "Item not found", status: 404 };
}

/** Fetch a single product by slug (product code, e.g. "M-DR-0001") */
export async function fetchProduct(
  slug: string
): Promise<ApiResult<Product>> {
  if (!USE_LIVE_API) {
    try {
      const data = await mock.getProduct(slug);
      if (!data)
        return { ok: false, error: "Product not found", status: 404 };
      return { ok: true, data };
    } catch (err) {
      return { ok: false, error: (err as Error).message, status: 500 };
    }
  }

  const result = await fetchJson<BackendMiniatureItem>(
    endpoints.miniature(slug)
  );
  if (!result.ok) return result;

  const item = result.data;
  const { baseName } = parseBackendName(item.name);

  // Determine if this product has siblings (is part of a multi-variant group)
  // by fetching the full list and checking
  const listResult = await fetchJson<BackendCatalogResponse>(
    `${endpoints.miniatures()}?limit=1000`
  );
  let parentItemSlug: string | undefined;
  if (listResult.ok) {
    const groups = groupByBaseName(listResult.data.items);
    const group = groups.get(baseName);
    if (group && group.length > 1) {
      parentItemSlug = toSlug(baseName);
    }
  }

  return {
    ok: true,
    data: backendToProduct(item, parentItemSlug),
  };
}

/** Create a new miniature with variants (admin only) */
export async function createMiniature(
  payload: CreateMiniaturePayload,
  token: string,
): Promise<ApiResult<unknown>> {
  return fetchJson(endpoints.miniatures(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

/** Upload images for a variant (admin only, multipart) */
export async function uploadVariantImages(
  productCode: string,
  files: File[],
  token: string,
): Promise<ApiResult<unknown>> {
  try {
    const form = new FormData();
    for (const file of files) {
      form.append("images", file);
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };
    if (API_KEY) {
      headers["x-api-key"] = API_KEY;
    }

    const res = await fetch(endpoints.variantImages(productCode), {
      method: "POST",
      headers,
      body: form,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { ok: false, error: body?.message ?? res.statusText, status: res.status };
    }
    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: (err as Error).message, status: 0 };
  }
}

/** Add a new variant to an existing miniature (admin only) */
export async function addVariant(
  productCode: string,
  payload: AddVariantPayload,
  token: string,
): Promise<ApiResult<unknown>> {
  return fetchJson(endpoints.addVariant(productCode), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

/** Update variant fields (admin only) */
export async function updateVariant(
  productCode: string,
  updates: UpdateVariantPayload,
  token: string,
): Promise<ApiResult<unknown>> {
  return fetchJson(endpoints.miniature(productCode), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
}
