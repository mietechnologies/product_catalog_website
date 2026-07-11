---
name: gortex-retailers-approved-1-dirs
description: "Work in the retailers/approved +1 dirs area — 17 symbols across 2 files (100% cohesion)"
---

# retailers/approved +1 dirs

17 symbols | 2 files | 100% cohesion

## When to Use

Use this skill when working on files in:
- `src/app/admin/retailers/approved/page.tsx`
- `src/lib/auth/api.ts`

## Key Files

| File | Symbols |
|------|---------|
| `src/app/admin/retailers/approved/page.tsx` | result, setRetailers, auth, loading, load, ... |
| `src/lib/auth/api.ts` | json, err, token, fetchApprovedRetailers, res, ... |

## Entry Points

- `src/app/admin/retailers/approved/page.tsx::ApprovedRetailersPage`
- `src/lib/auth/api.ts::fetchApprovedRetailers`

## How to Explore

```
get_communities with id: "community-51"
smart_context with task: "understand retailers/approved +1 dirs", format: "gcx"
find_usages with id: "src/app/admin/retailers/approved/page.tsx::ApprovedRetailersPage", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
