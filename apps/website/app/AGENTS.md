<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-08 | Updated: 2026-02-08 -->

# app

## Purpose

Next.js App Router directory containing all pages, layouts, and components for the website. Uses file-system based routing where each folder represents a route.

## Key Files

| File              | Description                                       |
| ----------------- | ------------------------------------------------- |
| `page.tsx`        | Home page component (route: `/`)                  |
| `layout.tsx`      | Root layout with HTML structure and global styles |
| `globals.css`     | Global Tailwind CSS styles                        |
| `favicon.ico`     | Website favicon                                   |
| `Header.tsx`      | Reusable header component with navigation tabs    |
| `Header.test.tsx` | Tests for the Header component                    |

## Subdirectories

| Directory   | Purpose                                                 |
| ----------- | ------------------------------------------------------- |
| `bytes/`    | Bytes (articles) pages - see `bytes/AGENTS.md`          |
| `nibbles/`  | Nibbles (recipes) pages - see `nibbles/AGENTS.md`       |
| `common/`   | Shared utilities and services - see `common/AGENTS.md`  |
| `assets/`   | SVG icon components - see `assets/AGENTS.md`            |
| `tilecard/` | Reusable tile card component - see `tilecard/AGENTS.md` |

## For AI Agents

### Working In This Directory

- Uses Next.js 15 App Router conventions
- Each route folder contains `page.tsx` (required) and optionally `layout.tsx`
- Dynamic routes use `[slug]` folder naming
- Export `metadata` for SEO from each page
- Test files are colocated (e.g., `page.test.tsx`)

### Testing Requirements

- Create `.test.tsx` files alongside components
- Use React Testing Library patterns
- Mock Firebase services in tests

### Common Patterns

- `Header` component wraps most pages with navigation
- `Tilecard` component displays content previews
- `FirebaseService` singleton fetches all Firebase data
- Theme colors defined in `common/theme.ts`

## Dependencies

### Internal

- `common/FirebaseService` - Data fetching singleton
- `common/theme.ts` - Color constants
- `common/constants.ts` - Website name, metadata

<!-- MANUAL: -->
