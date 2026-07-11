---
name: gortex-item-slug
description: "Work in the item/[slug] area — 18 symbols across 1 files (100% cohesion)"
---

# item/[slug]

18 symbols | 1 files | 100% cohesion

## When to Use

Use this skill when working on files in:
- `src/app/item/[slug]/page.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `src/app/item/[slug]/page.tsx` | auth, toast, activeVariant, setAddOpen, activeVariantSlug, ... |

## Entry Points

- `src/app/item/[slug]/page.tsx::ItemPage`

## How to Explore

```
get_communities with id: "community-3"
smart_context with task: "understand item/[slug]", format: "gcx"
find_usages with id: "src/app/item/[slug]/page.tsx::ItemPage", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
