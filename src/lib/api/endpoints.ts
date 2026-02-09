/**
 * API endpoint definitions — matches the MIETech product_catalog_api backend.
 *
 * Set NEXT_PUBLIC_API_URL (e.g. "http://localhost:3000") to point at the backend.
 * When not set, the client falls back to the in-memory mock server.
 */

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

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

  /** POST /api/users/retailer — create retailer account (pending approval) */
  createRetailer: () => `${BASE_URL}/api/users/retailer`,

  /** GET /api/users/retailers/pending — list pending retailer accounts */
  pendingRetailers: () => `${BASE_URL}/api/users/retailers/pending`,

  /** GET /api/users/retailers/approved — list approved retailer accounts */
  approvedRetailers: () => `${BASE_URL}/api/users/retailers/approved`,

  /** PATCH /api/users/retailers/:id/approve — approve a retailer */
  approveRetailer: (id: string) =>
    `${BASE_URL}/api/users/retailers/${encodeURIComponent(id)}/approve`,

  /** PATCH /api/users/retailers/:id/reject — reject a retailer */
  rejectRetailer: (id: string) =>
    `${BASE_URL}/api/users/retailers/${encodeURIComponent(id)}/reject`,

  /** GET /api/users/me — get current user profile */
  me: () => `${BASE_URL}/api/users/me`,

  /** PATCH /api/users/me — update current user profile */
  updateMe: () => `${BASE_URL}/api/users/me`,

  /** PATCH /api/users/me/password — change password */
  updatePassword: () => `${BASE_URL}/api/users/me/password`,

  /** POST /api/miniatures/:productCode/variants — add a new variant to a miniature */
  addVariant: (productCode: string) =>
    `${BASE_URL}/api/miniatures/${encodeURIComponent(productCode)}/variants`,

  /** POST /api/miniatures/:productCode/images — upload images for a variant */
  variantImages: (productCode: string) =>
    `${BASE_URL}/api/miniatures/${encodeURIComponent(productCode)}/images`,
} as const;
