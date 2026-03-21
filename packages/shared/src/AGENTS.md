<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-08 | Updated: 2026-02-16 -->

# src

## Purpose

Source code for the shared package, providing centralized TypeScript types, Zod schemas, and Firebase configuration for both the CMS and website applications.

## Key Files

| File       | Description                                          |
| ---------- | ---------------------------------------------------- |
| `index.ts` | Barrel file exporting all types, schemas, and config |

## Subdirectories

| Directory  | Purpose                                             |
| ---------- | --------------------------------------------------- |
| `types/`   | TypeScript type definitions - see `types/AGENTS.md` |
| `schemas/` | Zod schema definitions - see `schemas/AGENTS.md`    |
| `config/`  | Firebase configuration - see `config/AGENTS.md`     |
| `utils/`   | Shared helpers (byte finished gate, legacy body text) - see `utils/AGENTS.md` |

## For AI Agents

### Working In This Directory

- All exports must go through `index.ts` for proper package resolution
- Vitest unit tests: `*.test.ts` colocated under `utils/` (and similar) next to the module under test
- Types define the shape of data structures
- Schemas provide runtime validation with Zod
- Keep types and schemas in sync when modifying

### Common Patterns

- Types use TypeScript interfaces
- Schemas use Zod for validation
- Export naming convention: `*Type` for types, `*Schema` for Zod schemas
- Content types: `Byte`, `Nibble`, `ByteSeries`

<!-- MANUAL: -->
