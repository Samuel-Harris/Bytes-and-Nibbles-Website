<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-08 | Updated: 2026-02-16 -->

# shared

## Purpose

Shared package providing TypeScript types, Zod schemas, and Firebase configuration that are consumed by both the CMS and website applications. Published as `@bytes-and-nibbles/shared` within the monorepo.

## Key Files

| File               | Description                        |
| ------------------ | ---------------------------------- |
| `package.json`     | Package configuration with exports |
| `tsconfig.json`    | TypeScript configuration           |
| `eslint.config.js` | ESLint configuration               |
| `vitest.config.ts` | Vitest config for package unit tests |

## Subdirectories

| Directory | Purpose                           |
| --------- | --------------------------------- |
| `src/`    | Source code - see `src/AGENTS.md` |

## For AI Agents

### Working In This Directory

- Changes affect both CMS and website apps
- Package name: `@bytes-and-nibbles/shared`
- Run `pnpm lint` to lint the package
- Run `pnpm --filter @bytes-and-nibbles/shared test` (or `pnpm test` from repo root) for unit tests
- No build step required (TypeScript files are consumed directly)

### Testing Requirements

- Vitest unit tests live under `src/**` as `*.test.ts` (e.g. `utils/byteFinished.test.ts`)
- Types are validated at compile time

### Common Patterns

- Types are defined in `src/types/` directory
- Zod schemas are defined in `src/schemas/` directory
- All exports go through `src/index.ts` barrel file

## Dependencies

### External

- TypeScript - Type definitions
- Zod - Runtime schema validation
- Firebase - Configuration types

<!-- MANUAL: -->
