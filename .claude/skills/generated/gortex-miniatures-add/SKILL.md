---
name: gortex-miniatures-add
description: "Work in the miniatures/add area — 27 symbols across 1 files (100% cohesion)"
---

# miniatures/add

27 symbols | 1 files | 100% cohesion

## When to Use

Use this skill when working on files in:
- `src/app/admin/miniatures/add/page.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `src/app/admin/miniatures/add/page.tsx` | baseName, setLoading, fileInputRefs, field, loading, ... |

## Entry Points

- `src/app/admin/miniatures/add/page.tsx::AddMiniaturePage`

## How to Explore

```
get_communities with id: "community-2"
smart_context with task: "understand miniatures/add", format: "gcx"
find_usages with id: "src/app/admin/miniatures/add/page.tsx::AddMiniaturePage", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
