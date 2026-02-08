<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-08 | Updated: 2026-02-08 -->

# shared

## Purpose

Shared package providing TypeScript types, Zod schemas, and Firebase configuration that are consumed by both the CMS and website applications. Published as `@bytes-and-nibbles/shared` within the monorepo.

## Key Files

| File               | Description                        |
| ------------------ | ---------------------------------- |
| `package.json`     | Package configuration with exports |
| `tsconfig.json`    | TypeScript configuration           |
| `eslint.config.js` | ESLint configuration               |

## Subdirectories

| Directory | Purpose                           |
| --------- | --------------------------------- |
| `src/`    | Source code - see `src/AGENTS.md` |

## For AI Agents

### Working In This Directory

- Changes affect both CMS and website apps
- Package name: `@bytes-and-nibbles/shared`
- Run `pnpm lint` to lint the package
- No build step required (TypeScript files are consumed directly)

### Testing Requirements

- Currently no tests in the shared package
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
