---
name: gortex-external-call-dep-1-dirs
description: "Work in the external-call::dep:. +1 dirs area — 23 symbols across 2 files (82% cohesion)"
---

# external-call::dep:. +1 dirs

23 symbols | 2 files | 82% cohesion

## When to Use

Use this skill when working on files in:
- `external-call::dep:./mockServer`
- `src/lib/api/client.ts`

## Key Files

| File | Symbols |
|------|---------|
| `external-call::dep:./mockServer` | ./mockServer |
| `src/lib/api/client.ts` | slug, groupByBaseName, err, item, data, ... |

## Entry Points

- `src/lib/api/client.ts::fetchProduct`

## Connected Communities

- **api · fetchItem** (1 cross-edges)
- **src/lib +1 dirs** (1 cross-edges)

## How to Explore

```
get_communities with id: "community-33"
smart_context with task: "understand external-call::dep:. +1 dirs", format: "gcx"
find_usages with id: "src/lib/api/client.ts::fetchProduct", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
