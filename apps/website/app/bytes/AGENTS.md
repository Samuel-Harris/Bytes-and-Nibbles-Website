<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-08 | Updated: 2026-02-16 -->

# bytes

## Purpose

Pages for displaying Bytes (tech articles/blog posts). Contains the bytes listing page and the dynamic individual byte page.

## Key Files

| File                     | Description                              |
| ------------------------ | ---------------------------------------- |
| `page.tsx`               | Bytes listing page (route: `/bytes`)     |
| `page.test.tsx`          | Tests for the listing page               |
| `layout.tsx`             | Layout wrapper for bytes pages           |
| `TilecardSubheading.tsx` | Subheading component for byte tile cards |

## Subdirectories

| Directory | Purpose                                               |
| --------- | ----------------------------------------------------- |
| `[slug]/` | Dynamic individual byte page - see `[slug]/AGENTS.md` |

## For AI Agents

### Working In This Directory

- Listing page displays all published bytes as tile cards
- Dynamic route `[slug]` displays individual byte content
- Uses `FirebaseService` to fetch byte data
- Generate static params for SSG with `generateStaticParams`

### Common Patterns

- Export `metadata` for SEO
- Fetch data via `FirebaseService.getInstance()`
- Map bytes to `Tilecard` components for listing
- Series color used as accent on tile cards

<!-- MANUAL: -->
