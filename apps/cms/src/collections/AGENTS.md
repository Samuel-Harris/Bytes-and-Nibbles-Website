<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-08 | Updated: 2026-02-08 -->

# collections

## Purpose

FireCMS collection definitions that define the structure and behavior of content types in the CMS. Each collection maps to a Firestore collection and specifies fields, validation, and callbacks.

## Key Files

| File                | Description                                                            |
| ------------------- | ---------------------------------------------------------------------- |
| `v1_bytes.tsx`      | Byte (article) collection with sections, subsections, and rich content |
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
  - Subsections (with their own body content)
  - Collapsible groups
- Publication status and dates

**Nibbles** (recipes):

- Title, source, slug
- Thumbnail and cover photo
- Ingredients list with quantities and measurements
- Ordered steps
- Serving count and preparation time

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
};
```

<!-- MANUAL: -->
