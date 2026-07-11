---
name: gortex-orders-create-2-dirs
description: "Work in the orders/create +2 dirs area — 20 symbols across 3 files (86% cohesion)"
---

# orders/create +2 dirs

20 symbols | 3 files | 86% cohesion

## When to Use

Use this skill when working on files in:
- `src/app/orders/create/page.tsx`
- `src/app/profile/page.tsx`
- `src/lib/auth/api.ts`

## Key Files

| File | Symbols |
|------|---------|
| `src/app/orders/create/page.tsx` | handleSubmit, e, result |
| `src/app/profile/page.tsx` | result, load |
| `src/lib/auth/api.ts` | json, body, err, createOrder, res, ... |

## Entry Points

- `src/lib/auth/api.ts::fetchMe`

## How to Explore

```
get_communities with id: "community-49"
smart_context with task: "understand orders/create +2 dirs", format: "gcx"
find_usages with id: "src/lib/auth/api.ts::fetchMe", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
