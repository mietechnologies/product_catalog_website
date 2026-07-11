---
name: gortex-admin-create
description: "Work in the admin/create area — 25 symbols across 1 files (100% cohesion)"
---

# admin/create

25 symbols | 1 files | 100% cohesion

## When to Use

Use this skill when working on files in:
- `src/app/admin/create/page.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `src/app/admin/create/page.tsx` | verifying, setLastName, CreateAdminPage, setLoading, confirmPassword, ... |

## Entry Points

- `src/app/admin/create/page.tsx::CreateAdminPage`

## How to Explore

```
get_communities with id: "community-1"
smart_context with task: "understand admin/create", format: "gcx"
find_usages with id: "src/app/admin/create/page.tsx::CreateAdminPage", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
