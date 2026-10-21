/**
 * API endpoint definitions — matches the MIETech product_catalog_api backend.
 *
 * Set NEXT_PUBLIC_API_URL (e.g. "http://localhost:3000") to point at the backend.
 * When not set, the client falls back to the in-memory mock server.
 */

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const endpoints = {
  /**
   * GET /api/products?page=&limit=&productType=&category=&collection=&size=&hasVariants=&minPrice=&maxPrice=
   * Paginated list of every product type with optional server-side filters.
   */
  products: () => `${BASE_URL}/api/products`,

  /**
   * GET /api/products/search?q=&productType=&page=&limit=
   * Full-text search with relevance scoring.
   */
  search: () => `${BASE_URL}/api/products/search`,

  /** GET /api/products/meta — product types, categories, and collections in use */
  productMeta: () => `${BASE_URL}/api/products/meta`,

  /** GET|PATCH /api/products/:productCode — single sellable unit (miniature variant or print) */
  product: (productCode: string) =>
    `${BASE_URL}/api/products/${encodeURIComponent(productCode)}`,

  /** POST /api/miniatures — create a miniature with variants */
  miniatures: () => `${BASE_URL}/api/miniatures`,

  /** POST /api/keys/validate — validate an API key */
  validateApiKey: () => `${BASE_URL}/api/keys/validate`,

  /** POST /api/users/login — admin sign-in */
  login: () => `${BASE_URL}/api/users/login`,

  /** POST /api/users/admin — create admin account */
  createAdmin: () => `${BASE_URL}/api/users/admin`,

  /** GET /api/users/me — get current user profile */
  me: () => `${BASE_URL}/api/users/me`,

  /** PATCH /api/users/me — update current user profile */
  updateMe: () => `${BASE_URL}/api/users/me`,

  /** PATCH /api/users/me/password — change password */
  updatePassword: () => `${BASE_URL}/api/users/me/password`,

  /** POST /api/miniatures/:productCode/variants — add a new variant to a miniature */
  addVariant: (productCode: string) =>
    `${BASE_URL}/api/miniatures/${encodeURIComponent(productCode)}/variants`,

  /** POST /api/products/:productCode/images — upload images for a miniature variant or print */
  variantImages: (productCode: string) =>
    `${BASE_URL}/api/products/${encodeURIComponent(productCode)}/images`,
} as const;
