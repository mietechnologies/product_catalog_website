/**
 * API endpoint definitions — the catalog routes on the shared MieTech backend
 * (mietechnologies_website_backend).
 *
 * Set NEXT_PUBLIC_API_URL (e.g. "http://localhost:8000") to point at the backend.
 * When not set, the client falls back to the in-memory mock server.
 */

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const CATALOG = `${BASE_URL}/api/catalog/products`;
const ADMIN_CATALOG = `${BASE_URL}/api/admin/catalog/products`;

export const endpoints = {
  /**
   * GET /api/catalog/products?page=&limit=&productType=&category=&collection=&size=&hasVariants=&minPrice=&maxPrice=
   * Paginated list of every product type with optional server-side filters.
   */
  products: () => CATALOG,

  /**
   * GET /api/catalog/products/search?q=&productType=&page=&limit=
   * Search with relevance ranking.
   */
  search: () => `${CATALOG}/search`,

  /** GET /api/catalog/products/meta — product types, categories, and collections in use */
  productMeta: () => `${CATALOG}/meta`,

  /** GET /api/catalog/products/:productCode — single sellable unit (miniature variant or print) */
  product: (productCode: string) =>
    `${CATALOG}/${encodeURIComponent(productCode)}`,

  /** POST /api/admin/catalog/products — create a miniature or print (admin) */
  createProduct: () => ADMIN_CATALOG,

  /** PATCH /api/admin/catalog/products/:productCode — update a sellable unit (admin) */
  updateProduct: (productCode: string) =>
    `${ADMIN_CATALOG}/${encodeURIComponent(productCode)}`,

  /** POST /api/admin/catalog/products/:productCode/variants — add a variant to a miniature (admin) */
  addVariant: (productCode: string) =>
    `${ADMIN_CATALOG}/${encodeURIComponent(productCode)}/variants`,

  /** POST /api/admin/catalog/products/:productCode/images — upload images for a variant or print (admin) */
  variantImages: (productCode: string) =>
    `${ADMIN_CATALOG}/${encodeURIComponent(productCode)}/images`,

  /** POST /api/auth/login — shared MieTech sign-in (sets the session cookie) */
  login: () => `${BASE_URL}/api/auth/login`,

  /** POST /api/auth/logout — ends the shared session */
  logout: () => `${BASE_URL}/api/auth/logout`,

  /** GET /api/auth/me — the signed-in user */
  me: () => `${BASE_URL}/api/auth/me`,
} as const;
