---
name: gortex-miniatures-add-2-dirs
description: "Work in the miniatures/add +2 dirs area — 19 symbols across 3 files (93% cohesion)"
---

# miniatures/add +2 dirs

19 symbols | 3 files | 93% cohesion

## When to Use

Use this skill when working on files in:
- `src/app/admin/miniatures/add/page.tsx`
- `src/lib/api/client.ts`
- `src/lib/types.ts`

## Key Files

| File | Symbols |
|------|---------|
| `src/app/admin/miniatures/add/page.tsx` | payload, result, variantsWithFiles, handleSubmit, e, ... |
| `src/lib/api/client.ts` | T, url, headers, fetchJson, res, ... |
| `src/lib/types.ts` | CreateMiniaturePayload |

## Entry Points

- `src/lib/api/client.ts::createMiniature`

## How to Explore

```
get_communities with id: "community-30"
smart_context with task: "understand miniatures/add +2 dirs", format: "gcx"
find_usages with id: "src/lib/api/client.ts::createMiniature", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
