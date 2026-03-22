<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-08 | Updated: 2026-02-16 -->

# website

## Purpose

A Next.js 15 public-facing website that displays content from the CMS. Renders "Bytes" (tech articles/blog posts) and "Nibbles" (recipes) in a beautiful, responsive interface. The site uses static generation for performance and is deployed to Firebase Hosting.

## Key Files

| File                     | Description                                   |
| ------------------------ | --------------------------------------------- |
| `package.json`           | Website package dependencies and scripts      |
| `next.config.js`         | Next.js configuration (static export enabled) |
| `tsconfig.json`          | TypeScript configuration                      |
| `tailwind.config.ts`     | Tailwind CSS configuration                    |
| `postcss.config.js`      | PostCSS configuration                         |
| `eslint.config.mjs`      | ESLint configuration                          |
| `vitest.config.ts`       | Vitest configuration (jsdom, aliases, coverage) |
| `vitest.setup.ts`        | Vitest setup (`@testing-library/jest-dom/vitest`, mocks) |
| `README.md`              | Website-specific documentation                |
| `website_screenshot.png` | Screenshot of the website for README          |
| `firestore.indexes.json` | Firestore index configuration                 |

## Subdirectories

| Directory    | Purpose                                                       |
| ------------ | ------------------------------------------------------------- |
| `app/`       | Next.js App Router pages and components - see `app/AGENTS.md` |
| `public/`    | Static assets served at root URL                              |
| `__mocks__/` | Static module mocks for Vitest (e.g. markdown / highlighter) |
| `out/`       | Static export output (generated)                              |
| `.next/`     | Next.js build cache (generated)                               |
| `coverage/`  | Test coverage reports (generated)                             |

## For AI Agents

### Working In This Directory

- Run `pnpm dev` or `pnpm dev:website` (from root) to start dev server
- Development server runs on `http://localhost:3000`
- Uses Next.js App Router (not Pages Router)
- Static export is configured (`output: 'export'` in next.config.js)
- Build with `pnpm build`

### Testing Requirements

- Run `pnpm test` to execute Vitest (`vitest run` in this package; root `vitest.config.ts` also lists this app as a project)
- Tests are colocated with source files (e.g., `page.test.tsx` next to `page.tsx`)
- Uses React Testing Library for component testing
- Aim for good test coverage on critical components

### Common Patterns

- Pages use Next.js App Router conventions (`page.tsx`, `layout.tsx`)
- `FirebaseService` singleton fetches data from Firestore
- Dynamic routes use `[slug]` folder pattern
- Metadata (title, description) is exported from each page
- Components use Tailwind CSS for styling

## Dependencies

### Internal

- `@bytes-and-nibbles/shared` - Shared types, schemas, and Firebase config

### External

- Next.js v16.x - React framework with static export
- React v19.x - UI framework
- Firebase v12.x - Backend services
- Tailwind CSS - Styling
- Vitest + React Testing Library - Testing
- React Markdown + Syntax Highlighter - Content rendering
- Heroicons - Icons

<!-- MANUAL: -->
