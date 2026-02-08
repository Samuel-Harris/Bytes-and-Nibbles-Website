<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-08 | Updated: 2026-02-08 -->

# nibbles

## Purpose

Pages for displaying Nibbles (recipes). Contains the nibbles listing page and the dynamic individual nibble page.

## Key Files

| File                     | Description                                            |
| ------------------------ | ------------------------------------------------------ |
| `page.tsx`               | Nibbles listing page (route: `/nibbles`)               |
| `page.test.tsx`          | Tests for the listing page                             |
| `layout.tsx`             | Layout wrapper for nibbles pages                       |
| `TilecardSubheading.tsx` | Subheading component for nibble tile cards (cook time) |
| `timeUtils.ts`           | Utility to format cooking time duration                |

## Subdirectories

| Directory | Purpose                                                 |
| --------- | ------------------------------------------------------- |
| `[slug]/` | Dynamic individual nibble page - see `[slug]/AGENTS.md` |

## For AI Agents

### Working In This Directory

- Listing page displays all published nibbles as tile cards
- Dynamic route `[slug]` displays individual recipe
- Uses `FirebaseService` to fetch nibble data
- Tile card shows cooking time as subheading

### Common Patterns

- Format time duration (e.g., "1h 30m") using `formatTimeMinutes`
- Generate static params for SSG
- Export `metadata` with recipe title for SEO

<!-- MANUAL: -->
