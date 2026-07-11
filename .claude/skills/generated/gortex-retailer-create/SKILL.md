---
name: gortex-retailer-create
description: "Work in the retailer/create area — 19 symbols across 1 files (100% cohesion)"
---

# retailer/create

19 symbols | 1 files | 100% cohesion

## When to Use

Use this skill when working on files in:
- `src/app/retailer/create/page.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `src/app/retailer/create/page.tsx` | setSubmitted, lastName, firstName, canSubmit, merchantName, ... |

## Entry Points

- `src/app/retailer/create/page.tsx::CreateRetailerPage`

## How to Explore

```
get_communities with id: "community-11"
smart_context with task: "understand retailer/create", format: "gcx"
find_usages with id: "src/app/retailer/create/page.tsx::CreateRetailerPage", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
