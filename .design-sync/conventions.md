# MieTech Product Catalog — conventions

Components are plain React + **Tailwind CSS v4 utility classes**; there is no provider needed for styling. Load `styles.css` (it imports the compiled `_ds_bundle.css`) and render components from `window.Mietech`. Only `ToastProvider` is a wrapper: any component calling `useToast()` must sit inside it.

## Styling idiom: Tailwind utilities + brand tokens
Style your own layout glue with the same utilities. Never hardcode hex values; use the token names. Tokens are CSS variables (`var(--color-primary)`, `var(--color-accent-dark)`, …) and the utilities the components use exist as classes (`bg-primary`, `bg-primary/10`, `text-primary`, `text-accent-dark`, `border-neutral/30`, …); for a token/utility combination not in `styles.css`, use `style={{ color: 'var(--color-primary-light)' }}`:

| Token | Use |
|---|---|
| `primary` / `primary-light` / `primary-dark` | buttons, links, active states / hover / pressed (`#014878` base) |
| `accent` / `accent-light` / `accent-dark` | secondary actions, highlights (`#F18805` base); `accent-dark` for accent text |
| `neutral` / `neutral-light` / `neutral-dark` | borders (`border-neutral/15`, `/30`), muted text, ghost text |

Surfaces: page `#fafafa`, cards/inputs `bg-white`, body text `#1a1a1a` (`text-gray-900` for headings). Cards: `rounded-xl border border-neutral/15 shadow-sm`; controls: `rounded-lg`; pills: `rounded-full`. Status colors: `red-50/300/800` error, `green-50/300/800` success. Focus ring is global (2px accent) — don't restyle it.
Utilities available for layout glue: `flex`, `grid`, `grid-cols-1..6` (+ `sm:`/`md:`/`lg:`/`xl:`), `gap-*`, `p*/m*-{0..6,8,10,12,16}`, `space-x/y-*`, `items-*`, `justify-*`, `text-xs..3xl`, `font-medium/semibold/bold`, `max-w-sm..7xl`. Utilities outside `styles.css` do not exist at runtime — check it before inventing one.

## Components
Use the library component rather than raw elements: `Button` (variant `primary` | `secondary` | `ghost`), `Input`, `Select` (takes `options` + `placeholder`), `Badge` (`default` | `accent` | `outline`), `Card` (`as="article"` for list items), `Skeleton`/`CardSkeleton` for loading, `PlaceholderImage` (needs `name` + `category`; size it with `className`, e.g. `h-full w-full` inside a sized box). Catalog composites: `ProductCard`, `ProductGrid` (handles loading / error / empty states itself), `SearchBar`, `FiltersBar`, `ProductTypeTabs`. Product detail: `Gallery`, `PriceBlock`, `Breadcrumbs`, `AttributionCredit`. Links render as plain anchors. Font: system sans stack (Inter is named but never loaded, matching the live app).

## Where the truth lives
Read `styles.css` and its imports (tokens under `@theme`, compiled utilities in `_ds_bundle.css`), and each component's `.d.ts` + `.prompt.md` under `components/<group>/<Name>/`. Domain values: product types `miniature` | `print`; sizes Tiny, Small, Medium, Large, Huge, Gargantuan; miniature categories are creature types (Dragon, Undead, Beast, …).

## Example
```jsx
const { Button, Badge, Card, Input } = window.Mietech;
<Card as="article">
  <div className="p-4 grid gap-3">
    <h3 className="font-semibold text-sm text-gray-900">Ancient Red Dragon</h3>
    <div className="flex gap-2"><Badge>Dragon</Badge><Badge variant="accent">Halloween</Badge></div>
    <Input placeholder="Search by name or code..." />
    <Button variant="secondary">Request a quote</Button>
  </div>
</Card>
```
