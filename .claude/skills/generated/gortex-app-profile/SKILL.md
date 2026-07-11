---
name: gortex-app-profile
description: "Work in the app/profile area — 31 symbols across 1 files (98% cohesion)"
---

# app/profile

31 symbols | 1 files | 98% cohesion

## When to Use

Use this skill when working on files in:
- `src/app/profile/page.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `src/app/profile/page.tsx` | email, newPassword, setMerchantName, lastName, canSaveProfile, ... |

## Entry Points

- `src/app/profile/page.tsx::ProfilePage`

## Connected Communities

- **orders/create +2 dirs** (1 cross-edges)

## How to Explore

```
get_communities with id: "community-52"
smart_context with task: "understand app/profile", format: "gcx"
find_usages with id: "src/app/profile/page.tsx::ProfilePage", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
