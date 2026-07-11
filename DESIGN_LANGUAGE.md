# MIETech Product Catalog — Design Language

> **Purpose:** This document is the single source of truth for design decisions in this project. Reference it when building new pages, components, or features to keep the UI consistent.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 + React 19 |
| Styling | Tailwind CSS v4 (no external UI library) |
| Fonts | Inter (loaded via CSS) |
| Icons | Heroicons — inline SVG, `strokeWidth={1.5}`, 24×24 viewBox |

All components are custom-built. Do **not** install shadcn, MUI, Radix, or any third-party component library without discussion.

---

## Color Tokens

Defined in `src/app/globals.css` under `@theme`. Always use the Tailwind token names — never hardcode hex values in components.

### Brand Colors

| Token | Hex | Tailwind Class | Use |
|---|---|---|---|
| `--color-primary` | `#014878` | `primary` | Buttons, links, active states, logo text |
| `--color-primary-light` | `#0369a8` | `primary-light` | Hover state for primary elements |
| `--color-primary-dark` | `#013358` | `primary-dark` | Active/pressed state for primary elements |
| `--color-accent` | `#F18805` | `accent` | Secondary buttons, highlights, alerts |
| `--color-accent-light` | `#f5a03d` | `accent-light` | Hover state for accent elements |
| `--color-accent-dark` | `#c96e04` | `accent-dark` | Active state for accent elements; accent badge text |
| `--color-neutral` | `#787878` | `neutral` | Borders (`/15`, `/30`), dividers, secondary text |
| `--color-neutral-light` | `#a0a0a0` | `neutral-light` | Placeholder text, muted labels |
| `--color-neutral-dark` | `#505050` | `neutral-dark` | Ghost button text, subdued body text |

### Semantic / Surface Colors

| Usage | Value | Notes |
|---|---|---|
| Page background | `#fafafa` | Set on `body` in globals.css |
| Body text | `#1a1a1a` | Set on `body` in globals.css |
| Card / input background | `#ffffff` | White |
| Focus outline | `accent` | 2px solid, 2px offset — set globally |

### Status Colors (Toasts & Semantic States)

| State | Background | Border | Text |
|---|---|---|---|
| Error | `red-50` | `red-300` | `red-800` |
| Success | `green-50` | `green-300` | `green-800` |
| Info | `primary/5` | `primary/30` | `primary` |

### Opacity Pattern

Transparency is applied using Tailwind's `/` modifier — **not** by importing alpha hex variants:

```
bg-primary/10      → 10% opacity fill (badge backgrounds)
bg-primary/20      → focus ring fill
border-neutral/15  → subtle card border
border-neutral/30  → input border
hover:bg-primary/5 → nav item hover
```

---

## Typography

**Font:** Inter — loaded via `--font-sans` CSS variable, falls back to `ui-sans-serif, system-ui, sans-serif`.

| Role | Classes | Notes |
|---|---|---|
| Page heading | `text-2xl font-bold` | Main `<h1>` on content pages |
| Section heading | `text-lg font-semibold` | Card titles, section labels |
| Logo wordmark | `text-lg font-bold text-primary tracking-tight` | Header only |
| Logo tagline | `text-[10px] text-neutral tracking-widest uppercase` | "Making It Easier" sub-label |
| Body / default | `text-sm` (14px) | Base size for all body content |
| Labels | `text-xs font-medium` | Badges, table headers, supporting text |
| Placeholder | `placeholder:text-neutral-light` | Inputs |

**Rules:**
- Base font size is `text-sm`. Do not use `text-base` unless there is a strong typographic reason.
- Use `font-medium` (500) for interactive controls and labels. Use `font-semibold` (600) for headings within cards. Use `font-bold` (700) for page-level headings and the brand name.
- Avoid `tracking-*` utilities except for the logo tagline (`tracking-widest`) and brand name (`tracking-tight`).

---

## Spacing & Layout

### Container

```html
<div class="mx-auto max-w-7xl px-4 sm:px-6">
```

This is the standard page wrapper. Use it on every page's main content area.

### Page Content Area

```html
<main class="mx-auto max-w-7xl px-4 sm:px-6 py-8">
```

### Spacing Scale in Use

| Token | Size | Common usage |
|---|---|---|
| `gap-1` | 4px | Tight icon+label pairs |
| `gap-1.5` | 6px | Nav icon+label |
| `gap-2` | 8px | Button icon+label, form field stacks |
| `gap-3` | 12px | Filter chip rows |
| `gap-4` | 16px | Grid columns, section spacing |
| `gap-6` | 24px | Larger grid layouts |
| `p-4` | 16px | Card content padding |
| `py-8` | 32px | Page vertical padding |
| `px-3 py-2` | 12px / 8px | Input and button padding |

---

## Border Radius

| Radius | Token | Used on |
|---|---|---|
| `rounded-lg` | 8px | Buttons, inputs, selects, toast notifications |
| `rounded-xl` | 12px | Cards |
| `rounded-full` | 50% | Badges, filter pills |
| `rounded` | 4px | Dismiss button inside toasts |
| `border-radius: 2px` | — | Global focus outline (set in globals.css) |

---

## Shadows & Elevation

| Level | Class | Used on |
|---|---|---|
| Resting | `shadow-sm` | Cards (default state) |
| Raised | `shadow-md` | Cards on hover, modals |
| Overlay | `shadow-lg` | Toast notifications |

Always pair shadow changes with `transition-shadow` for smooth hover effects.

---

## Motion & Transitions

| Effect | Classes | Used on |
|---|---|---|
| Color transitions | `transition-colors` | Buttons, inputs, nav items, links |
| Shadow transitions | `transition-shadow` | Cards |
| All properties | `transition-all` | Toasts (enter/exit) |
| Image zoom | `transition-transform duration-300` | Product images, logo |
| Image hover scale | `group-hover:scale-105` | Product card image, logo |
| Toast enter | `translate-x-0 opacity-100` | Visible toast |
| Toast exit | `translate-x-full opacity-0` | Dismissing toast (300ms) |

**Rule:** Use `transition-colors` by default. Only escalate to `transition-all` or `transition-transform` when other properties must also animate.

---

## Components

### Button

**File:** `src/components/ui/Button.tsx`

Three variants. Default is `primary`.

```tsx
<Button variant="primary">Save</Button>   // Blue — primary actions
<Button variant="secondary">Cancel</Button> // Orange — secondary actions
<Button variant="ghost">Close</Button>    // Transparent — tertiary / icon buttons
```

| Variant | Background | Text | Hover | Active |
|---|---|---|---|---|
| `primary` | `bg-primary` | white | `bg-primary-light` | `bg-primary-dark` |
| `secondary` | `bg-accent` | white | `bg-accent-light` | `bg-accent-dark` |
| `ghost` | transparent | `text-neutral-dark` | `bg-neutral/10` | `bg-neutral/20` |

Base classes: `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50`

### Card

**File:** `src/components/ui/Card.tsx`

```tsx
<Card>...</Card>
<Card as="article">...</Card> // semantic HTML variant
```

Classes: `rounded-xl border border-neutral/15 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md`

Use `Card` as the container for all product listings, detail panels, forms, and admin sections.

### Badge

**File:** `src/components/ui/Badge.tsx`

```tsx
<Badge>Default</Badge>           // Blue tint — categories, info labels
<Badge variant="accent">New</Badge>   // Orange tint — highlights, promotions
<Badge variant="outline">Draft</Badge> // Neutral outline — status, inactive
```

Base classes: `inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium`

### Input

**File:** `src/components/ui/Input.tsx`

```tsx
<Input type="text" placeholder="Search..." />
```

Classes: `w-full rounded-lg border border-neutral/30 bg-white px-3 py-2 text-sm placeholder:text-neutral-light hover:border-neutral focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:pointer-events-none disabled:opacity-50 transition-colors`

### Select

**File:** `src/components/ui/Select.tsx`

Identical border/focus behaviour to Input. Uses `appearance-none` with a custom SVG dropdown arrow.

### Toast / Notifications

**File:** `src/components/ui/Toast.tsx`

Toasts are triggered via the `useToast()` hook:

```tsx
const { toast } = useToast();
toast("Saved successfully", "success");
toast("Something went wrong", "error");
toast("Processing your request", "info");
```

- Position: `fixed bottom-4 right-4` (bottom-right corner)
- Auto-dismiss after **5 seconds**
- Exit animation: slide right + fade (300ms)
- Three variants: `error` (red), `success` (green), `info` (primary blue)

### Skeleton

**File:** `src/components/ui/Skeleton.tsx`

Use for loading states. Applied as a `className` extension on placeholder elements.

---

## Layout Patterns

### Header

**File:** `src/components/layout/Header.tsx`

```
sticky top-0 z-50 border-b border-neutral/15 bg-white/95 backdrop-blur-sm
```

- Height: `h-16`
- Contains: logo + wordmark (left), nav links (right)
- Nav uses `rounded-lg px-3 py-2` ghost-style links with `hover:bg-primary/5 hover:text-primary`

### Slide Menu

**File:** `src/components/layout/SlideMenu.tsx`

Overlay drawer triggered from the header Menu button. Sits at `z-[60]` above the header.

### Product Grid

```html
<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
```

Product images use `aspect-square object-contain` inside a wrapper div, with `group-hover:scale-105 transition-transform duration-300` for the zoom effect.

### Filter Bar

Horizontal flex row with wrapping:

```html
<div class="flex flex-wrap items-center gap-3">
```

Filter pills: `rounded-full border px-3 py-1.5 text-sm font-medium`
- Active: `border-primary bg-primary text-white`
- Inactive: `border-neutral/30 bg-white hover:bg-neutral/5`

### Tables (Admin)

Admin list views use `<table>` with:
- Header: `text-xs font-medium text-neutral-dark uppercase tracking-wide`
- Row dividers: `divide-y divide-neutral/10`
- Row hover: `hover:bg-primary/5`

### Modals

Overlay: `fixed inset-0 z-50 flex items-center justify-center bg-black/50`
Panel: `Card` with `shadow-lg max-w-lg w-full mx-4 p-6`

---

## Icons

All icons are **inline Heroicons SVGs** — no icon font or library import.

Standard attributes:

```tsx
<svg
  className="h-4 w-4"           // or h-5 w-5 for larger contexts
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  strokeWidth={1.5}
  stroke="currentColor"
  aria-hidden="true"
>
  <path strokeLinecap="round" strokeLinejoin="round" d="..." />
</svg>
```

- Size `h-4 w-4` (16px) — inside buttons, nav items
- Size `h-5 w-5` (20px) — standalone icons, toast icons
- Always `aria-hidden="true"` when decorative; pair with visible text or `aria-label` on the parent

---

## Accessibility

- **Focus rings:** Globally set in `globals.css` — `2px solid accent` with `2px offset`. Do not override `focus:outline-none` without replacing with an equivalent visible focus state.
- **ARIA:** All interactive icons use `aria-hidden="true"`. Buttons without visible text labels must have `aria-label`.
- **Live regions:** Toast container uses `aria-live="polite"` and `role="alert"` on individual toasts.
- **Scroll behaviour:** `scroll-behavior: smooth` is set globally on `<html>`.
- **Scrollbar:** Custom 8px scrollbar styled with `neutral-light` track/thumb.

---

## Do's and Don'ts

| Do | Don't |
|---|---|
| Use `text-primary`, `bg-accent`, etc. | Hardcode `#014878` or other hex values |
| Use `Button`, `Card`, `Input`, `Badge` components | Re-implement these inline with one-off Tailwind |
| Use `rounded-xl` for Cards, `rounded-lg` for controls | Mix radius values arbitrarily |
| Use `shadow-sm` → `hover:shadow-md` for elevation | Use `shadow-lg` on cards |
| Use Heroicons inline SVG with `strokeWidth={1.5}` | Import icon libraries or emoji as icons |
| Use `transition-colors` on interactive elements | Skip transitions on hover states |
| Use `text-sm` as the default text size | Default to `text-base` |
| Use `opacity-50` + `pointer-events-none` for disabled states | Use `cursor-not-allowed` alone |
| Use the `useToast()` hook for user feedback | Use `alert()` or custom inline error states |
