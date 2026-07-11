---
name: gortex-orders-create
description: "Work in the orders/create area — 16 symbols across 1 files (100% cohesion)"
---

# orders/create

16 symbols | 1 files | 100% cohesion

## When to Use

Use this skill when working on files in:
- `src/app/orders/create/page.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `src/app/orders/create/page.tsx` | setSubmitting, index, setItems, toast, updateItem, ... |

## Entry Points

- `src/app/orders/create/page.tsx::CreateOrderPage`

## How to Explore

```
get_communities with id: "community-7"
smart_context with task: "understand orders/create", format: "gcx"
find_usages with id: "src/app/orders/create/page.tsx::CreateOrderPage", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
