<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-08 | Updated: 2026-02-16 -->

# [slug]

## Purpose

Dynamic route for displaying individual Nibble (recipe) pages. Renders the full recipe with ingredients list and preparation steps.

## Key Files

| File            | Description                      |
| --------------- | -------------------------------- |
| `page.tsx`      | Individual nibble page component |
| `page.test.tsx` | Tests for the nibble page        |

## For AI Agents

### Working In This Directory

- `[slug]` is Next.js dynamic route syntax
- `generateStaticParams` exports all nibble slugs for static generation
- Content is fetched via `FirebaseService.getNibble(slug)`
- Recipe layout includes ingredients sidebar and ordered steps

### Recipe Page Structure

```
page.tsx (NibblePage)
└── Header + cover photo
    ├── Recipe metadata (servings, time)
    ├── Ingredients list (with quantities, measurements)
    └── Steps (ordered list)
```

### Testing Requirements

- Mock `FirebaseService` in tests
- Test ingredient rendering (quantity, measurement, name)
- Test step ordering
- Verify SEO metadata generation

### Common Patterns

- `generateMetadata` for dynamic SEO based on recipe
- `generateStaticParams` for SSG
- Format time using `formatTimeMinutes` utility
- Optional ingredients marked distinctly

<!-- MANUAL: -->
