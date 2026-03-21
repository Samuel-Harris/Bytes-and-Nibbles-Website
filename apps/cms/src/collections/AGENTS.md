<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-08 | Updated: 2026-03-21 -->

# collections

## Purpose

FireCMS collection definitions that define the structure and behavior of content types in the CMS. Each collection maps to a Firestore collection and specifies fields, validation, and callbacks.

## Key Files

| File                | Description                                                            |
| ------------------- | ---------------------------------------------------------------------- |
| `v1_bytes.tsx`      | Byte collection: sections, subsections, subsubsections, rich content, `is_finished` on each unit, publish gate |
| `normalizeByteBodyForCms.ts` | Coerces legacy string paragraph/LaTeX values to maps when loading bytes in the CMS |
| `v1_byteSeries.tsx` | Byte Series collection for grouping related articles                   |
| `v1_nibbles.tsx`    | Nibble (recipe) collection with ingredients and steps                  |

## For AI Agents

### Working In This Directory

- Collections use FireCMS `buildCollection` and `buildProperty` helpers
- Properties define field types, validation, and custom components
- Changes affect what editors see and can input in the CMS
- Collection IDs (e.g., `v1_bytes`) must match Firestore collection names

### Content Structure

**Bytes** (articles):

- Title, subtitle, slug, series reference
- Thumbnail and cover photo (Firebase Storage)
- Sections with nested body content:
  - Paragraphs (Markdown), LaTeX paragraphs
  - Captioned images
  - Subsections (body may include **subsubsections** and leaf blocks)
  - Subsubsections (inner body is leaf-only: same block types as a collapsible group, no nested subsubsection)
  - Collapsible groups
- Each structural unit and leaf block has **Marked finished?** (`is_finished`, default off); publishing is blocked until all are finished (with paths in the error)
- Publication status and dates

**Nibbles** (recipes):

- Title, source, slug
- Thumbnail and cover photo
- Ingredients list with quantities and measurements
- Ordered steps
- Serving count and preparation time
- **Recipe marked finished?** (`is_finished`); publishing blocked until set

**Byte Series**:

- Title and accent color for visual branding

### Common Patterns

- Use `buildProperty` for each field definition
- Custom components via `Field` property
- `oneOf` for polymorphic content (paragraphs, images, subsections)
- `callbacks.onPreSave` for pre-save logic
- Storage paths in format: `images/{type}/{category}`

### Body Element Types

```typescript
// Section body can contain:
SECTION_BODY_ELEMENT_TYPES = {
  SUBSECTION,
  PARAGRAPH,
  LATEX_PARAGRAPH,
  CAPTIONED_IMAGE,
  COLLAPSIBLE_GROUP,
};

// Subsection body can contain:
SUBSECTION_BODY_ELEMENT_TYPES = {
  PARAGRAPH,
  LATEX_PARAGRAPH,
  CAPTIONED_IMAGE,
  COLLAPSIBLE_GROUP,
  SUBSUBSECTION,
};
```

<!-- MANUAL: -->
