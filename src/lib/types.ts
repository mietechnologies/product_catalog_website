/** Core product types for the MIETech catalog */

/** Credit for a third-party 3D model. Omitted/null for in-house models. */
export interface Attribution {
  creator?: string;
  modelUrl?: string;
}

export interface ProductBase {
  slug: string;
  name: string;
  productCode: string; // Format: M-[XX]-[0000]
  price: number;
  description: string;
  images: string[]; // 1-5 images
  thumbnail?: string | null;
  size: ProductSize;
  creatureType: CreatureType;
  attributes: Record<string, string>;
  attribution?: Attribution | null;
}

/** A standalone product OR a variant of a base item */
export interface Product extends ProductBase {
  parentItemSlug?: string; // If this is a variant, reference to parent item
}

/** A base item that groups variants together */
export interface BaseItem {
  slug: string;
  name: string;
  productCode?: string; // Base items may not have a product code
  description: string;
  image: string; // Primary display image
  creatureType: CreatureType;
  size: ProductSize; // Representative size
  hasVariants: boolean;
  variants: Product[];
  priceRange?: { min: number; max: number };
  attribution?: Attribution | null;
}

/** Catalog listing card — flattened for grid display */
export interface CatalogEntry {
  slug: string;
  name: string;
  productCode?: string;
  image: string;
  price?: number;
  priceRange?: { min: number; max: number };
  size: ProductSize;
  creatureType: CreatureType;
  hasVariants: boolean;
  type: "product" | "item"; // Determines navigation: /product/[slug] or /item/[slug]
}

export type ProductSize =
  | "Tiny"
  | "Small"
  | "Medium"
  | "Large"
  | "Huge"
  | "Gargantuan";

export type CreatureType =
  | "Aberration"
  | "Beast"
  | "Celestial"
  | "Construct"
  | "Dragon"
  | "Elemental"
  | "Fey"
  | "Fiend"
  | "Giant"
  | "Humanoid"
  | "Monstrosity"
  | "Ooze"
  | "Plant"
  | "Undead";

export const CREATURE_TYPES: CreatureType[] = [
  "Aberration",
  "Beast",
  "Celestial",
  "Construct",
  "Dragon",
  "Elemental",
  "Fey",
  "Fiend",
  "Giant",
  "Humanoid",
  "Monstrosity",
  "Ooze",
  "Plant",
  "Undead",
];

export const PRODUCT_SIZES: ProductSize[] = [
  "Tiny",
  "Small",
  "Medium",
  "Large",
  "Huge",
  "Gargantuan",
];

export type SortOption = "name-asc" | "price-low" | "price-high";

export interface CatalogFilters {
  query?: string;
  creatureType?: CreatureType;
  size?: ProductSize;
  hasVariants?: boolean;
  priceMin?: number;
  priceMax?: number;
  sort?: SortOption;
}

// ── Admin payload types ──────────────────────────────────────────────

export interface CreateMiniatureVariant {
  name: string;
  description?: string;
  size: string;
  fileName: string;
  price?: {
    cost?: number;
    wholesale?: number;
    msrp?: number;
  };
}

export interface UpdateVariantPayload {
  name?: string;
  description?: string;
  size?: string;
  /** Applies to the parent miniature (all variants). null removes it. */
  attribution?: Attribution | null;
  price?: {
    cost?: number;
    wholesale?: number;
    msrp?: number;
  };
}

export interface AddVariantPayload {
  name: string;
  size: string;
  fileName: string;
  description?: string;
  price?: {
    cost?: number;
    wholesale?: number;
    msrp?: number;
  };
}

export interface CreateMiniaturePayload {
  baseName: string;
  description?: string;
  category: string;
  attribution?: Attribution;
  variants: CreateMiniatureVariant[];
}

/** API response wrappers */
export interface ApiResponse<T> {
  data: T;
  ok: true;
}

export interface ApiError {
  ok: false;
  error: string;
  status: number;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

export interface CatalogResponse {
  entries: CatalogEntry[];
  total: number;
}

// ── Backend API response shapes ──────────────────────────────────────

/** Shape of a single item returned by GET /api/miniatures and GET /api/miniatures/:productCode */
export interface BackendMiniatureItem {
  productCode: string;
  name: string; // "BaseName, VariantName"
  description?: string;
  size: string;
  category: string;
  thumbnail: string | null;
  images: Record<string, string>; // { "0": "url", "1": "url" }
  attribution?: Attribution | null;
  cost: number;
  wholesale: number;
  msrp: number;
}

/** Shape of GET /api/miniatures response */
export interface BackendCatalogResponse {
  page: number;
  totalPages: number;
  totalItems: number;
  items: BackendMiniatureItem[];
}
