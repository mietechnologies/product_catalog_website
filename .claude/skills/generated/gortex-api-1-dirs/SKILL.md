---
name: gortex-api-1-dirs
description: "Work in the api +1 dirs area — 39 symbols across 3 files (93% cohesion)"
---

# api +1 dirs

39 symbols | 3 files | 93% cohesion

## When to Use

Use this skill when working on files in:
- `src/lib/api/client.ts`
- `src/lib/api/mockServer.ts`
- `src/lib/types.ts`

## Key Files

| File | Symbols |
|------|---------|
| `src/lib/api/client.ts` | query, filters, sortEntries, entries, getEffectivePrice, ... |
| `src/lib/api/mockServer.ts` | q, matchesQuery, product, results, buildCatalogEntries, ... |
| `src/lib/types.ts` | SortOption, CatalogEntry, CatalogResponse |

## Entry Points

- `src/lib/api/client.ts::applyAllFiltersMock`
- `src/lib/api/mockServer.ts::matchesQuery`
- `src/lib/api/mockServer.ts::sortEntries`
- `src/lib/api/mockServer.ts::getCatalog`
- `src/lib/api/client.ts::applyRemainingFilters`

## Connected Communities

- **api · delay** (1 cross-edges)

## How to Explore

```
get_communities with id: "community-43"
smart_context with task: "understand api +1 dirs", format: "gcx"
find_usages with id: "src/lib/api/client.ts::applyAllFiltersMock", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
