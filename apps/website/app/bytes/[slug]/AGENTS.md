<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-08 | Updated: 2026-03-21 -->

# [slug]

## Purpose

Dynamic route for displaying individual Byte (tech article) pages. Renders the full article content with sections, subsections, subsubsections, paragraphs, images, LaTeX content, and collapsible sections.

## Key Files

| File                      | Description                                               |
| ------------------------- | --------------------------------------------------------- |
| `page.tsx`                | Individual byte page component                            |
| `page.test.tsx`           | Tests for the byte page                                   |
| `Body.tsx`                | Renders subsection body (subsubsection + leaf blocks)     |
| `LeafBody.tsx`            | Leaf-only body (paragraph, LaTeX, image, collapsible group) |
| `LeafBody.test.tsx`       | Tests leaf rendering including map-shaped paragraph/LaTeX values |
| `Section.tsx`             | Renders article sections with headings                    |
| `Section.test.tsx`        | Tests for Section component (string and map-shaped body values) |
| `Subsection.tsx`          | Renders nested subsections within sections                |
| `Subsection.test.tsx`     | Tests for Subsection component                            |
| `Subsubsection.tsx`       | Renders subsubsections under a subsection (`text-lg` heading) |
| `Subsubsection.test.tsx`  | Tests for Subsubsection component                       |
| `Paragraph.tsx`           | Renders Markdown paragraph content                        |
| `Paragraph.test.tsx`      | Tests for Paragraph component                             |
| `CaptionedImage.tsx`      | Renders images with captions                              |
| `CaptionedImage.test.tsx` | Tests for CaptionedImage component                        |
| `Collapsible.tsx`         | Generic collapsible container component                   |
| `CollapsibleGroup.tsx`    | Wrapper for groups of collapsible items                   |
| `ExpandableImage.tsx`     | Image component that expands to full-screen on click      |
| `LatexParagraph.tsx`      | Renders LaTeX math content using KaTeX                    |
| `SvgFitter.tsx`           | Utility for scaling SVGs correctly in layout              |

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
    └── Section (for each section; maps section body inline)
        ├── Paragraph, CaptionedImage, LatexParagraph, CollapsibleGroup
        └── Subsection
            └── Body (subsection-level blocks)
                ├── Subsubsection
                │   └── LeafBody → Paragraph | LatexParagraph | CaptionedImage | CollapsibleGroup
                └── LeafBody (one leaf block per wrapper from Body)
        (CollapsibleGroup inner content uses LeafBody only)
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
