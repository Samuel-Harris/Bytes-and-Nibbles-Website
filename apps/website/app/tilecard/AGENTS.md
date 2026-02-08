<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-08 | Updated: 2026-02-08 -->

# tilecard

## Purpose

Reusable tile card component for displaying content previews on listing pages.

## Key Files

| File                | Description                                           |
| ------------------- | ----------------------------------------------------- |
| `Tilecard.tsx`      | Tile card component with image, title, and subheading |
| `Tilecard.test.tsx` | Tests for the tile card component                     |

## For AI Agents

### Working In This Directory

- `Tilecard` is used on both Bytes and Nibbles listing pages
- Accepts thumbnail image, title, subheading (React element), and link
- Styled with Tailwind CSS for responsive design
- Subheading slot allows custom content (series name, cook time, etc.)

### Component Props

```typescript
interface TilecardProps {
  thumbnail: string; // Image URL
  title: string; // Card title
  subheading: ReactNode; // Custom subheading element
  href: string; // Link destination
}
```

<!-- MANUAL: -->
