<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-08 | Updated: 2026-03-21 -->

# schemas

## Purpose

Zod schema definitions for runtime validation of content types. These schemas complement the TypeScript types and enable runtime validation.

## Key Files

| File            | Description                                                           |
| --------------- | --------------------------------------------------------------------- |
| `bytes.ts`      | Zod schemas for Byte content (ByteSchema, section/body element types) |
| `nibbles.ts`    | Zod schema for Nibble content                                         |
| `byteSeries.ts` | Zod schema for Byte Series                                            |

## For AI Agents

### Working In This Directory

- Schemas must stay in sync with corresponding types in `../types/`
- Use Zod's `.parse()` or `.safeParse()` for validation where Zod builders exist
- `bytes.ts` exports `SECTION_BODY_ELEMENT_TYPES`, `SUBSECTION_BODY_ELEMENT_TYPES` (includes `SUBSUBSECTION` / `"subsubsection"`), and TypeScript schema types such as `SubsubsectionBodyElementSchema`, `SubsubsectionSchema`, and `SubsectionBodyElementSchema`

### Schema Structure

```typescript
// bytes.ts exports (among others):
export const ByteSchema: z.ZodType<ByteType>;
export const SECTION_BODY_ELEMENT_TYPES;
export const SUBSECTION_BODY_ELEMENT_TYPES; // includes SUBSUBSECTION
export type SubsubsectionBodyElementSchema; // leaf-only subsection interior
export type SubsubsectionSchema;
export type SubsectionBodyElementSchema; // subsubsection | leaf

// nibbles.ts exports:
export const NibbleSchema: z.ZodType<NibbleType>;

// byteSeries.ts exports:
export const ByteSeriesSchema: z.ZodType<ByteSeriesType>;
```

<!-- MANUAL: -->
