<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-08 | Updated: 2026-02-08 -->

# [slug]

## Purpose

Dynamic route for displaying individual Byte (tech article) pages. Renders the full article content with sections, subsections, paragraphs, images, and LaTeX content.

## Key Files

| File                      | Description                                               |
| ------------------------- | --------------------------------------------------------- |
| `page.tsx`                | Individual byte page component                            |
| `page.test.tsx`           | Tests for the byte page                                   |
| `Body.tsx`                | Renders section body content (polymorphic content blocks) |
| `Section.tsx`             | Renders article sections with headings                    |
| `Section.test.tsx`        | Tests for Section component                               |
| `Subsection.tsx`          | Renders nested subsections within sections                |
| `Subsection.test.tsx`     | Tests for Subsection component                            |
| `Paragraph.tsx`           | Renders Markdown paragraph content                        |
| `Paragraph.test.tsx`      | Tests for Paragraph component                             |
| `CaptionedImage.tsx`      | Renders images with captions                              |
| `CaptionedImage.test.tsx` | Tests for CaptionedImage component                        |

## For AI Agents

### Working In This Directory

- `[slug]` is Next.js dynamic route syntax
- `generateStaticParams` exports all byte slugs for static generation
- Content is fetched via `FirebaseService.getByte(slug)`
- Components recursively render nested content structure

### Content Rendering Flow

```
page.tsx (BytePage)
└── Header + cover photo
    └── Section (for each section)
        └── Body (polymorphic content)
            ├── Paragraph (Markdown)
            ├── CaptionedImage
            ├── Subsection
            │   └── Body (nested)
            └── CollapsibleGroup
                └── Body (nested)
```

### Testing Requirements

- Mock `FirebaseService` in tests
- Test content rendering for different body element types
- Verify SEO metadata generation

### Common Patterns

- `generateMetadata` for dynamic SEO based on byte content
- `generateStaticParams` for SSG
- Recursive content rendering with type discrimination
- Markdown rendered via prose styles (Tailwind Typography-like)

<!-- MANUAL: -->
