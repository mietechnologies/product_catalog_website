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
│   └── (retail)/           # Retail routes (feature-flagged; thin re-exports of modules/retail)
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

Flags live in `src/lib/features.ts` and are driven by `NEXT_PUBLIC_*` environment variables. They are inlined at build time, so **rebuild after changing one**. A flag is on only when its variable is exactly `true`.

| Flag | Variable | Default | Controls |
| ---- | -------- | ------- | -------- |
| `retail` | `NEXT_PUBLIC_FEATURE_RETAIL` | off | Retailer sign-up, ordering, and the retailer/order admin pages |

When `retail` is **off**:

- `/orders`, `/orders/create`, `/orders/:id`, `/retailer/create`, `/admin/retailers/*` and `/admin/orders/*` return 404 (gated once in `src/app/(retail)/layout.tsx`).
- The slide-menu order/retail links and the "Retailer? Register here" login link are not rendered.

Everything retail-specific lives in `src/modules/retail/` plus the thin route files in `src/app/(retail)/`. Core code touches the module only through the exports in `src/modules/retail/index.ts`.

```bash
# Local development
echo "NEXT_PUBLIC_FEATURE_RETAIL=true" >> .env.local

# Docker
docker build --build-arg NEXT_PUBLIC_FEATURE_RETAIL=true -t mietech-catalog .
```

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
| `fetchCatalog()`   | `GET /api/miniatures?limit=1000`          | Fetch all variants, group & filter client-side |
| `fetchItem(slug)`  | `GET /api/miniatures?limit=1000`          | Fetch all, find group by base name |
| `fetchProduct(id)` | `GET /api/miniatures/:productCode`        | Fetch single variant by code       |

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
