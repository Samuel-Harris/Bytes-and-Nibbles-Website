<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-08 | Updated: 2026-02-16 -->

# cms

## Purpose

A headless Content Management System built with [FireCMS](https://firecms.co/) v3 for creating, editing, and publishing "Bytes" (tech articles) and "Nibbles" (recipes). Provides an admin interface for content creators with rich text editing, image uploads, and structured content management.

## Key Files

| File                 | Description                          |
| -------------------- | ------------------------------------ |
| `package.json`       | CMS package dependencies and scripts |
| `vite.config.ts`     | Vite build configuration             |
| `index.html`         | Entry HTML file                      |
| `tsconfig.json`      | TypeScript configuration             |
| `tailwind.config.js` | Tailwind CSS configuration           |
| `postcss.config.js`  | PostCSS configuration for Tailwind   |
| `eslint.config.js`   | ESLint configuration                 |
| `README.md`          | CMS-specific documentation           |

## Subdirectories

| Directory | Purpose                             |
| --------- | ----------------------------------- |
| `src/`    | Source code - see `src/AGENTS.md`   |
| `public/` | Static assets (favicon, icons)      |
| `build/`  | Production build output (generated) |

## For AI Agents

### Working In This Directory

- Run `pnpm dev` or `pnpm dev:cms` (from root) to start development server
- Development server runs on `http://localhost:5173`
- Uses FireCMS v3 with Firebase backend
- Authentication via Google Sign-in or email/password
- Build with `pnpm build`

### Testing Requirements

- Currently no tests in the CMS package
- Lint with `pnpm lint`

### Common Patterns

- Collections are defined using FireCMS `buildCollection` and `buildProperty` helpers
- Custom field components extend FireCMS fields with additional functionality
- Firebase config is imported from `@bytes-and-nibbles/shared`

## Dependencies

### Internal

- `@bytes-and-nibbles/shared` - Shared types, schemas, and Firebase config

### External

- `@firecms/core` v3.x - Core CMS framework
- `@firecms/firebase` - Firebase integration for FireCMS
- `@firecms/ui` - UI components
- React v19.x - UI framework
- Vite - Build tool
- Tailwind CSS - Styling

<!-- MANUAL: -->
