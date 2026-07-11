---
name: gortex-api-fetchitem
description: "Work in the api · fetchItem area — 16 symbols across 1 files (76% cohesion)"
---

# api · fetchItem

16 symbols | 1 files | 76% cohesion

## When to Use

Use this skill when working on files in:
- `src/lib/api/client.ts`

## Key Files

| File | Symbols |
|------|---------|
| `src/lib/api/client.ts` | baseItem, slug, prices, variants, itemSlug, ... |

## Entry Points

- `src/lib/api/client.ts::fetchItem`

## Connected Communities

- **external-call::dep:. +1 dirs** (2 cross-edges)
- **api · groupsToCatalogEntries** (1 cross-edges)
- **src/lib +1 dirs** (1 cross-edges)

## How to Explore

```
get_communities with id: "community-35"
smart_context with task: "understand api · fetchItem", format: "gcx"
find_usages with id: "src/lib/api/client.ts::fetchItem", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
