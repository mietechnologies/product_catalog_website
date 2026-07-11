---
name: gortex-retailers-pending-1-dirs-pendingretailerspage
description: "Work in the retailers/pending +1 dirs · PendingRetailersPage area — 19 symbols across 2 files (93% cohesion)"
---

# retailers/pending +1 dirs · PendingRetailersPage

19 symbols | 2 files | 93% cohesion

## When to Use

Use this skill when working on files in:
- `src/app/admin/retailers/pending/page.tsx`
- `src/lib/auth/api.ts`

## Key Files

| File | Symbols |
|------|---------|
| `src/app/admin/retailers/pending/page.tsx` | retailers, setRetailers, result, toast, auth, ... |
| `src/lib/auth/api.ts` | body, err, res, token, fetchPendingRetailers, ... |

## Entry Points

- `src/app/admin/retailers/pending/page.tsx::PendingRetailersPage`
- `src/lib/auth/api.ts::fetchPendingRetailers`

## Connected Communities

- **retailers/pending +1 dirs · approveRetailer** (1 cross-edges)
- **retailers/pending +1 dirs · rejectRetailer** (1 cross-edges)

## How to Explore

```
get_communities with id: "community-54"
smart_context with task: "understand retailers/pending +1 dirs · PendingRetailersPage", format: "gcx"
find_usages with id: "src/app/admin/retailers/pending/page.tsx::PendingRetailersPage", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
