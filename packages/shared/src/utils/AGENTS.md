<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-21 | Updated: 2026-03-21 -->

# utils

## Purpose

Small shared helpers used by the CMS and website for byte content (finished-state checks and legacy body shape normalization).

## Key Files

| File               | Description                                                    |
| ------------------ | -------------------------------------------------------------- |
| `byteFinished.ts`  | Walks byte section trees; lists unfinished paths; formats publish errors; `markAllByteUnitsFinished` for CMS bulk “finished” |
| `byteContentText.ts` | Reads paragraph/LaTeX text from string or map-shaped Firestore values |
| `nibblePublishGuard.ts` | Shared copy for nibble publish guard (must match CMS `onPreSave`) |
| `*.test.ts`        | Vitest unit tests colocated with utils |

## For AI Agents

### Working In This Directory

- Export new utilities from `../index.ts` when they are part of the public package API.

<!-- MANUAL: -->
