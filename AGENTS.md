<!-- Generated: 2026-02-08 | Updated: 2026-10-04 -->

# Bytes and Nibbles Monorepo

## Purpose

A pnpm monorepo containing a headless content management system (CMS) and public website for managing and displaying "Bytes" (tech articles/blog posts) and "Nibbles" (recipes). The project uses Firebase for backend services (Firestore, Storage, Hosting, Authentication).

## Key Files

| File                  | Description                                                |
| --------------------- | ---------------------------------------------------------- |
| `package.json`        | Root workspace package with monorepo scripts               |
| `knip.jsonc`          | Knip config for unused dependency checks (`pnpm check:unused-deps`) |
| `pnpm-workspace.yaml` | pnpm workspace configuration and shared dependency catalog |
| `pnpm-lock.yaml`      | Locked dependency versions                                 |
| `vitest.config.ts`    | Root Vitest workspace (`projects`: `packages/shared`, `apps/website`, paths resolved from config file) |
| `firebase.json`       | Firebase hosting and deployment configuration              |
| `.firebaserc`         | Firebase project configuration                             |
| `firestore.rules`     | Firestore security rules                                   |
| `storage.rules`       | Firebase Storage security rules                            |
| `README.md`           | Comprehensive project documentation                        |
| `LICENSE`             | MIT License                                                |

## Subdirectories

| Directory   | Purpose                                                             |
| ----------- | ------------------------------------------------------------------- |
| `apps/`     | Application packages (CMS and Website) - see `apps/AGENTS.md`       |
| `packages/` | Shared packages (types, schemas, config) - see `packages/AGENTS.md` |
| `.github/`  | GitHub workflows and templates - see `.github/AGENTS.md`            |
| `.agents/`  | Portable agent skills - see `.agents/AGENTS.md`                     |
| `configs/`  | Shared configurations                                               |
| `docs/`     | Documentation files                                                 |

## For AI Agents

### Working In This Directory

- This is a **pnpm workspace monorepo** - use `pnpm` for all package management
- Run `pnpm install` from the root to install all dependencies
- Use workspace scripts: `pnpm dev:cms`, `pnpm dev:website`, `pnpm build`, `pnpm test`, `pnpm lint`, `pnpm check:unused-deps`
- Firebase configuration is shared via `@bytes-and-nibbles/shared` package
- TypeScript is used throughout the project

### Testing Requirements

- Run `pnpm test` to execute Vitest across workspace packages (`packages/shared` and `apps/website` are registered in the root `vitest.config.ts`)
- Run `pnpm lint` to lint all packages
- CI runs on pull requests to `main` branch

### Common Patterns

- Shared types and schemas are exported from `packages/shared`
- Import shared code as `@bytes-and-nibbles/shared`
- Both apps use React and TypeScript
- Tailwind CSS is used for styling in both apps

## Dependencies

### External

- `pnpm` - Package manager with workspace support
- Firebase SDK v12.x - Backend services
- TypeScript v5.x - Type safety
- React v19.x - UI framework

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->

### Cloud Agent development

The Cloud Agent environment installs Node.js 24.21.0 and pnpm 10.33.3 into `/usr/local/bin`. Prepend that directory to `PATH` before running `node` or `pnpm`, because the agent shell can resolve an older Node binary first.

On boot, the environment starts the website at `http://127.0.0.1:3000` and the CMS at `http://127.0.0.1:5173`. Both apps use the hosted `bytes-and-nibbles` Firebase project through the client configuration in `packages/shared`. The emulator ports in `firebase.json` are not connected to the applications.
