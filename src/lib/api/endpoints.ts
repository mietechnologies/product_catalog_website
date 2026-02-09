/**
 * API endpoint definitions — matches the MIETech product_catalog_api backend.
 *
 * Set NEXT_PUBLIC_API_URL (e.g. "http://localhost:3000") to point at the backend.
 * When not set, the client falls back to the in-memory mock server.
 */

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
export function getApiKey(): string {
  const envKey = process.env.NEXT_PUBLIC_API_KEY ?? "";
  if (envKey) return envKey;
  try {
    return localStorage.getItem("mietech-api-key") ?? "";
  } catch {
    return "";
  }
}

export const endpoints = {
  /**
   * GET /api/miniatures?page=&limit=&category=&size=&hasVariants=&minPrice=&maxPrice=
   * Paginated list with optional server-side filters.
   */
  miniatures: () => `${BASE_URL}/api/miniatures`,

  /**
   * GET /api/miniatures/search?q=&page=&limit=
   * Full-text search with relevance scoring.
   */
  search: () => `${BASE_URL}/api/miniatures/search`,

  /** GET /api/miniatures/:productCode — single variant by product code */
  miniature: (productCode: string) =>
    `${BASE_URL}/api/miniatures/${encodeURIComponent(productCode)}`,

  /** POST /api/keys/validate — validate an API key */
  validateApiKey: () => `${BASE_URL}/api/keys/validate`,

  /** POST /api/users/login — admin sign-in */
  login: () => `${BASE_URL}/api/users/login`,

  /** POST /api/users/admin — create admin account */
  createAdmin: () => `${BASE_URL}/api/users/admin`,

  /** POST /api/miniatures/:productCode/variants — add a new variant to a miniature */
  addVariant: (productCode: string) =>
    `${BASE_URL}/api/miniatures/${encodeURIComponent(productCode)}/variants`,

  /** POST /api/miniatures/:productCode/images — upload images for a variant */
  variantImages: (productCode: string) =>
    `${BASE_URL}/api/miniatures/${encodeURIComponent(productCode)}/images`,
} as const;
