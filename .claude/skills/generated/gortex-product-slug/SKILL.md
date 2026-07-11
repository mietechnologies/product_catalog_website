---
name: gortex-product-slug
description: "Work in the product/[slug] area — 23 symbols across 1 files (100% cohesion)"
---

# product/[slug]

23 symbols | 1 files | 100% cohesion

## When to Use

Use this skill when working on files in:
- `src/app/product/[slug]/page.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `src/app/product/[slug]/page.tsx` | parentName, is404, ProductPage, setEditOpen, setProduct, ... |

## Entry Points

- `src/app/product/[slug]/page.tsx::ProductPage`

## How to Explore

```
get_communities with id: "community-10"
smart_context with task: "understand product/[slug]", format: "gcx"
find_usages with id: "src/app/product/[slug]/page.tsx::ProductPage", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
