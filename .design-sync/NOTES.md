# design-sync notes

- This repo is a Next.js **app**, not a published package. `.design-sync/pkg/` is a small synthetic library: `entry.ts` re-exports the presentational components under `src/components` as named exports, `build.mjs` bundles them (react external; `next/link` and `next/image` aliased to plain `<a>`/`<img>` shims in `pkg/shims/`), emits `dist/types/*.d.ts` (with `@/` specifiers rewritten to relative), and compiles Tailwind v4 to `dist/styles.css` from `pkg/ds.css` (imports `src/app/globals.css` + a layout-utility safelist). Re-run `node .design-sync/pkg/build.mjs` before every sync (`buildCmd`).
- Build/validate commands (repo root, deps in `.ds-sync/`, plus `playwright` for the render check):
  `node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./node_modules --entry ./.design-sync/pkg/dist/index.es.js --out ./ds-bundle`, then `package-validate.mjs ./ds-bundle`.
- New components: add an `export` to `pkg/entry.ts`, author `previews/<Name>.tsx`. The `.d.ts` extractor can't resolve app types (CatalogEntry, CatalogFilters, HTML attribute extends), so `dtsPropsFor` in config.json holds hand-written prop bodies for Button, Input, Select, FiltersBar, ProductCard, ProductGrid, ProductTypeTabs, AttributionCredit, Breadcrumbs, CardSkeleton — update them if those props change.
- Font: CSS names "Inter" but the app never ships it (no @font-face / next/font) — live site renders the system sans fallback. User chose to match the live app; `runtimeFontPrefixes: ["Inter"]` silences `[FONT_MISSING]`.
- Not synced (need auth/API/router context): layout/Header, SlideMenu, admin modals, ImageUpload, item/VariantList, VariantDetailPanel, auth/PasswordChecklist, retail module screens.
- ToastProvider preview uses `cardMode: single` (toasts are `position: fixed`). ProductGrid Loading/Results cells look cropped in capture sheets only (sheet height cap); the cards themselves are fine.

## Known render warns
- none outstanding (GRID_OVERFLOW handled via `cfg.overrides` cardMode).

## Re-sync risks
- `pkg/ds.css` safelist and Tailwind scan root: Tailwind scans the whole repo, so new classes anywhere in `src/` or `.design-sync/previews/` change `styles.css`.
- Preview data (entries, images as inline SVG data URIs) is authored, not from the repo; real catalog data shape lives in `src/lib/types.ts`.
- `dtsPropsFor` bodies are hand-maintained (see above).
- Build assumed node 26, tailwindcss 4.1.x, react 19.2.
