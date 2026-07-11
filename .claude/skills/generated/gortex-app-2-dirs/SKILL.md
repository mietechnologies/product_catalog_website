---
name: gortex-app-2-dirs
description: "Work in the app +2 dirs area — 22 symbols across 3 files (83% cohesion)"
---

# app +2 dirs

22 symbols | 3 files | 83% cohesion

## When to Use

Use this skill when working on files in:
- `src/app/page.tsx`
- `src/lib/api/client.ts`
- `src/lib/types.ts`

## Key Files

| File | Symbols |
|------|---------|
| `src/app/page.tsx` | filtersFromParams |
| `src/lib/api/client.ts` | filters, token, filters, groups, params, ... |
| `src/lib/types.ts` | CatalogFilters |

## Entry Points

- `src/lib/api/client.ts::fetchCatalog`
- `src/lib/api/client.ts::buildListParams`

## Connected Communities

- **external-call::dep:. +1 dirs** (2 cross-edges)
- **api · groupsToCatalogEntries** (1 cross-edges)
- **api +1 dirs** (1 cross-edges)

## How to Explore

```
get_communities with id: "community-31"
smart_context with task: "understand app +2 dirs", format: "gcx"
find_usages with id: "src/lib/api/client.ts::fetchCatalog", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
