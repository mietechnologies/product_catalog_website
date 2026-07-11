---
name: gortex-orders-pending-1-dirs
description: "Work in the orders/pending +1 dirs area — 20 symbols across 2 files (96% cohesion)"
---

# orders/pending +1 dirs

20 symbols | 2 files | 96% cohesion

## When to Use

Use this skill when working on files in:
- `src/app/admin/orders/pending/page.tsx`
- `src/lib/auth/api.ts`

## Key Files

| File | Symbols |
|------|---------|
| `src/app/admin/orders/pending/page.tsx` | toast, result, orders, auth, router, ... |
| `src/lib/auth/api.ts` | json, url, err, limit, page, ... |

## Entry Points

- `src/app/admin/orders/pending/page.tsx::PendingOrdersPage`
- `src/lib/auth/api.ts::fetchUnfulfilledOrders`

## Connected Communities

- **orders/create +2 dirs** (1 cross-edges)

## How to Explore

```
get_communities with id: "community-55"
smart_context with task: "understand orders/pending +1 dirs", format: "gcx"
find_usages with id: "src/app/admin/orders/pending/page.tsx::PendingOrdersPage", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
