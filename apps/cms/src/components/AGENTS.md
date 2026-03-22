<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-08 | Updated: 2026-02-16 -->

# components

## Purpose

Custom FireCMS field components that extend the default field rendering with specialized functionality like Markdown preview, LaTeX rendering, and color pickers.

## Key Files

| File                         | Description                                     |
| ---------------------------- | ----------------------------------------------- |
| `MarkdownParagraphField.tsx` | Markdown text field with deferred preview (typing stays responsive) |
| `LatexParagraphField.tsx`    | LaTeX/math field with debounced MathJax preview   |
| `ColorField.tsx`             | Color picker with visual preview for hex colors |
| `GuardedIsPublishedField.tsx` | Publish toggle that blocks “on” until finish rules pass (matches `onPreSave`) |
| `MarkAllByteFinishedToolField.tsx` | In-form button to mark every byte block finished (`cmsUi_markAllContentFinished`, stripped on save) |

## For AI Agents

### Working In This Directory

- Custom fields extend FireCMS field behavior
- Use FireCMS `FieldProps` for type-safe field components
- Components receive `value`, `setValue`, and other props from FireCMS
- Preview/display functionality is key for editor UX

### Common Patterns

- Import field helpers from `@firecms/core`
- Use the `useMathJax` hook for LaTeX rendering
- Tailwind CSS for styling components
- Provide visual feedback for current field value

<!-- MANUAL: -->
