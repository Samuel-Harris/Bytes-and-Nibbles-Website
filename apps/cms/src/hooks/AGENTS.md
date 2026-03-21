<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-08 | Updated: 2026-02-16 -->

# hooks

## Purpose

Custom React hooks for the CMS application.

## Key Files

| File                 | Description                                                   |
| -------------------- | ------------------------------------------------------------- |
| `useMathJax.ts`      | Hook for loading and initializing MathJax for LaTeX rendering |
| `useDebouncedValue.ts` | Debounces a value for expensive derived UI (e.g. previews)  |

## For AI Agents

### Working In This Directory

- `useMathJax` loads MathJax library dynamically
- `useDebouncedValue` delays updates until input settles (used for LaTeX preview)
- Used by `LatexParagraphField` component for preview
- Handles async loading state and error handling

<!-- MANUAL: -->
