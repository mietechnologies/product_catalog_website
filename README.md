# MIETech Product Catalog — POC

A proof-of-concept product catalog website for **MIETech / MIETechnologies** ("Making It Easier"), showcasing 3D-printed tabletop miniatures for the D&D audience.

Built with **Next.js 16 App Router**, **TypeScript**, and **Tailwind CSS v4**.

---

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment (see "Connecting to the Backend" below)
cp .env.example .env.local
# Edit .env.local with your API URL and key

# Run the development server
npm run dev
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

> Without `NEXT_PUBLIC_API_URL` set, the app falls back to built-in mock data.

> Retail features (retailer sign-up, ordering, order/retailer admin) are **off by default**. Set `NEXT_PUBLIC_FEATURE_RETAIL=true` in `.env.local` to enable them — see [Feature Flags](#feature-flags).

### Other scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start dev server on port 8000        |
| `npm run build` | Create production build              |
| `npm start`     | Serve production build on port 8000  |
| `npm run lint`  | Run ESLint                           |

### Docker

```bash
# Build the image
docker build -t mietech-catalog .

# Run the container
docker run -p 8000:8000 mietech-catalog

# Build with the retail module enabled (flags are baked in at build time)
docker build --build-arg NEXT_PUBLIC_FEATURE_RETAIL=true -t mietech-catalog .
# Note: `docker run -e NEXT_PUBLIC_FEATURE_RETAIL=true` has NO effect — the flag
# is fixed when the image is built.
```

Open [http://localhost:8000](http://localhost:8000). The image uses a multi-stage build (~120 MB) with Next.js standalone output.

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (header + footer)
│   ├── page.tsx            # Catalog page (/)
│   ├── not-found.tsx       # 404 page
│   ├── item/[slug]/        # Base-item detail page (/item/:slug)
│   ├── product/[slug]/     # Product detail page (/product/:slug)
│   └── (retail)/           # Retail routes (feature-flagged; `page.retail.tsx` re-exports of modules/retail)
│
├── components/
│   ├── ui/                 # Generic UI primitives
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── PlaceholderImage.tsx
│   │   ├── Select.tsx
│   │   └── Skeleton.tsx
│   ├── catalog/            # Catalog-specific components
│   │   ├── SearchBar.tsx
│   │   ├── FiltersBar.tsx
│   │   ├── ProductGrid.tsx
│   │   └── ProductCard.tsx
│   ├── item/               # Item detail components
│   │   ├── VariantList.tsx
│   │   └── VariantDetailPanel.tsx
│   ├── product/            # Product detail components
│   │   ├── Breadcrumbs.tsx
│   │   ├── Gallery.tsx
│   │   └── PriceBlock.tsx
│   └── layout/
│       └── Header.tsx
│
├── data/
│   └── seed.ts             # All product/item seed data
│
├── modules/
│   └── retail/             # Retail feature module (see "Feature Flags")
│       ├── screens/        # Page bodies for the (retail) routes
│       ├── components/     # Menu links / login prompt slots used by core UI
│       ├── api.ts          # Retailer + order API calls
│       ├── endpoints.ts    # Retail endpoint paths
│       ├── orderStatus.ts  # Order status helpers
│       ├── types.ts        # Retailer / order types
│       └── index.ts        # Public surface for core code
│
└── lib/
    ├── features.ts         # Feature flags
    ├── types.ts            # TypeScript type definitions
    ├── utils.ts            # Utility functions (cn, formatPrice, etc.)
    └── api/
        ├── client.ts       # API client (entry point for all data fetching)
        ├── endpoints.ts    # REST endpoint path definitions
        └── mockServer.ts   # In-memory mock that simulates a REST API
```

---

## How to Edit Seed Data

All product data lives in **`src/data/seed.ts`**.

### Adding a standalone product

Add a new entry to the `standaloneProducts` array:

```ts
{
  slug: "your-slug",           // URL-safe identifier
  name: "Your Product Name",
  productCode: "M-XX-0001",   // Format: M-[creature code]-[4 digits]
  price: 12.99,
  description: "...",
  images: ["/images/your-image.jpg"],
  size: "Medium",              // Small | Medium | Large | Huge
  creatureType: "Beast",       // See CreatureType in lib/types.ts
  attributes: { ... },
}
```

### Adding a base item with variants

1. Create a variants array (each is a full `Product` with a `parentItemSlug`).
2. Add a `BaseItem` entry to the `baseItems` array referencing those variants.

---

## Feature Flags

Feature flags let parts of the app be shipped dark and switched on per environment. They are defined in **`src/lib/features.ts`** and driven by `NEXT_PUBLIC_*` environment variables.

| Flag     | Variable                      | Default | Controls                                                       |
| -------- | ----------------------------- | ------- | -------------------------------------------------------------- |
| `retail` | `NEXT_PUBLIC_FEATURE_RETAIL`  | **off** | Retailer sign-up, ordering, and the retailer/order admin pages |

### How flags are resolved

- A flag is **on only when its variable is exactly `true`**. Unset, empty, `false`, `1`, etc. all mean off.
- Values are **inlined at build time**, not read at runtime. Restart `npm run dev` or rebuild (`npm run build`, `docker build`) after changing one.
- Setting the variable on a running server or container (`next start`, `docker run -e …`) **does nothing** — the value was fixed when the app was built. To change a flag, rebuild with the new value.
- Flags are a **product/UX switch, not access control.** The backend API is unaffected by them and still enforces its own authentication and authorization; a flag only decides what this frontend builds and shows. Retailer accounts can still sign in with the retail flag off.

### Enabling the retail module

```bash
# Local development — add to .env.local, then restart `npm run dev`
NEXT_PUBLIC_FEATURE_RETAIL=true

# Production build
NEXT_PUBLIC_FEATURE_RETAIL=true npm run build

# Docker (the Dockerfile exposes it as a build arg, default false)
docker build --build-arg NEXT_PUBLIC_FEATURE_RETAIL=true -t mietech-catalog .
```

### What the `retail` flag controls

| | Flag **on** | Flag **off** |
| --- | --- | --- |
| Retailer routes: `/retailer/create` | Available | 404 (not built) |
| Order routes: `/orders`, `/orders/create`, `/orders/:id` | Available | 404 |
| Admin routes: `/admin/retailers/pending`, `/admin/retailers/approved`, `/admin/orders/pending`, `/admin/orders/:id` | Available | 404 |
| Slide menu: Create Order, My Orders, Retail Portal, Pending Orders | Shown | Hidden |
| Login page: "Retailer? Register here" link | Shown | Hidden |

Everything else is unaffected, including catalog browsing, login, profile, and admin tools for adding/editing miniatures (`/admin/create`, `/admin/miniatures/add`). Wholesale price fields in the admin variant forms are product pricing data and are not gated.

### How it is organized

- **`src/modules/retail/`** — all retail code: screens, retailer/order API calls and endpoints, types, order-status helpers, and the menu/login components. Core code imports it only through `src/modules/retail/index.ts`.
- **`src/app/(retail)/`** — thin route files that re-export the screens. This is a route group, so URLs are unchanged. The route files are named **`page.retail.tsx`**, and `next.config.ts` only registers the `retail.tsx` page extension when the flag is on. With the flag off these routes do not exist, so the screens and their API calls are not compiled into the build at all and the paths return 404. `layout.tsx` is a second line of defense that 404s if a retail route ever ends up built with the flag off.
- The menu and login components exported by the module check the flag themselves and render nothing when it is off, so core files contain no flag logic.

> **New retail routes** must be named `page.retail.tsx` (not `page.tsx`) so they are excluded from the build when the flag is off.

### Adding another flag

1. Add an entry to `features` in `src/lib/features.ts` (`process.env.NEXT_PUBLIC_FEATURE_<NAME> === "true"` — the full literal `process.env.NEXT_PUBLIC_…` access is required for Next.js to inline it).
2. Document it in `.env.example` and in the table above.
3. For a Dockerized build, add a matching `ARG`/`ENV` pair in the `Dockerfile`.

---

## Connecting to the Backend

The frontend connects to the **product_catalog_api** backend (Express + MongoDB). Set two environment variables in `.env.local`:

```bash
# URL of the running backend (default port 3000)
NEXT_PUBLIC_API_URL=http://localhost:3000

# API key (create one via POST /api/keys on the backend)
NEXT_PUBLIC_API_KEY=your-api-key-here
```

When `NEXT_PUBLIC_API_URL` is **not set** (or empty), the app automatically falls back to the built-in mock server with sample data — no backend required.

### Backend endpoints used

| Frontend function  | Backend endpoint                          | Purpose                            |
| ------------------ | ----------------------------------------- | ---------------------------------- |
| `fetchCatalog()`   | `GET /api/products?limit=1000` (or `/api/products/search`) | Fetch every product type, group miniature variants, filter client-side |
| `fetchItem(slug)`  | `GET /api/products?productType=miniature&limit=1000` | Fetch miniatures, find group by base name |
| `fetchProduct(id)` | `GET /api/products/:productCode`          | Fetch a miniature variant or print by code |
| `fetchProductMeta()` | `GET /api/products/meta`                | Collections in use, for the catalog filter |
| `createPrint()`    | `POST /api/products`                      | Create a print (figurine, toy, decor, ...) |

The catalog has tabs for **All**, **Miniatures**, and **Prints**. Miniatures keep size, creature type, and variants; prints are single products with a print category (Toy, Decor, Figurine, ...). Any product can belong to collections such as "Halloween".

All requests include the `x-api-key` header automatically.

### How the adapter works

```
UI components
    ↓ calls
src/lib/api/client.ts      ← decides live vs mock
    ├─→ Live: fetch() to backend → transform backend shapes → frontend types
    └─→ Mock: src/lib/api/mockServer.ts → src/data/seed.ts
```

The backend returns a flat list of variants (name format `"BaseName, VariantName"`). The client groups them by base name:
- Groups with **1 variant** → displayed as a standalone product → `/product/:productCode`
- Groups with **2+ variants** → displayed as a base item → `/item/:slug` (slug derived from base name)

Search, filter, and sort are applied **client-side** on the transformed data (the backend doesn't support query filtering yet).

### Obtaining an API key

```bash
# First call creates a master key
curl -X POST http://localhost:3000/api/keys

# Subsequent calls create user keys
curl -X POST http://localhost:3000/api/keys \
  -H "Content-Type: application/json" \
  -d '{"owner": "catalog-frontend"}'
```

Copy the returned key into `NEXT_PUBLIC_API_KEY` in `.env.local`.

## Mock fallback

When no backend is configured, the built-in mock server provides sample data with 12 catalog entries (including Red Dragon and Zombie variant groups). Mock functions add 200–600 ms simulated latency. Edit sample data in `src/data/seed.ts`.

---

## Purchasing Integration (Future)

The `PriceBlock` component currently shows a "Purchase coming soon" placeholder. To integrate purchasing (e.g. Stripe):

1. **Add a Cart context** — wrap the app in a cart provider in `layout.tsx`.
2. **Replace PriceBlock placeholder** with an "Add to Cart" button that dispatches to the cart context.
3. **Create a `/cart` page** showing cart contents + a Stripe Checkout button.
4. **Backend integration** — add a `/checkout` API endpoint that creates a Stripe Checkout Session and redirects the user.

The product detail pages (`/product/[slug]`) already display price and have a clear location for the purchase CTA.

---

## Design Decisions

- **Filters persist in the URL query string** so catalog links are shareable.
- **Search is debounced (300 ms)** to avoid excessive API calls.
- **PlaceholderImage component** renders creature-type-specific SVG icons instead of broken image links — replace with real product photos when available.
- **Accessible**: keyboard-navigable controls, visible focus rings, semantic headings, ARIA labels, and proper color contrast.
- **Mobile-first**: responsive grid (1 → 2 → 3 → 4 columns), stacked layouts on small screens.
