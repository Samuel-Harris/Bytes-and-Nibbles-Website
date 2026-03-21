<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-08 | Updated: 2026-03-21 -->

# types

## Purpose

TypeScript type definitions for content types used across the monorepo.

## Key Files

| File            | Description                                                                  |
| --------------- | ---------------------------------------------------------------------------- |
| `bytes.ts`      | Types for Byte content (ByteType, ByteOverviewType, sections, body elements) |
| `nibbles.ts`    | Types for Nibble content (NibbleType, NibbleOverviewType, ingredients)       |
| `byteSeries.ts` | Types for Byte Series (ByteSeriesType)                                       |

## For AI Agents

### Working In This Directory

- Types define the shape of Firestore documents
- Changes require updates to corresponding schemas in `../schemas/`
- Overview types are subsets used for listing pages
- Full types are used for detail pages

### Type Structure

**Bytes**:

- `ByteType` - Full article with sections and body content
- `ByteOverviewType` - Summary for listing (title, thumbnail, series, slug)
- `SectionType` - Article section with heading and body
- `SubsectionType` - Nested section; `body` may include subsubsections or leaf blocks
- `SubsubsectionType` - Under a subsection; `body` is leaf-only
- Related unions: `BaseContentType`, `CollapsibleGroupType`, `SubsubsectionBodyElementType`, `SubsectionBodyElementType`, `SectionBodyElementType`
- Every section, subsection, subsubsection, leaf block type, and collapsible group includes optional `is_finished` (default false when missing)

**Nibbles**:

- `NibbleType` - Full recipe with ingredients and steps; optional `is_finished` on the whole recipe (default false when missing)
- `NibbleOverviewType` - Summary for listing
- `IngredientType` - Ingredient with quantity and measurement

**Byte Series**:

- `ByteSeriesType` - Series with title and accent color

<!-- MANUAL: -->
