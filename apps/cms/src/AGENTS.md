<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-08 | Updated: 2026-02-16 -->

# src

## Purpose

Source code for the FireCMS application. Contains the main app component, collection definitions for content types, and custom UI components.

## Key Files

| File            | Description                                                 |
| --------------- | ----------------------------------------------------------- |
| `main.tsx`      | Application entry point, renders the React app              |
| `App.tsx`       | Main FireCMS application component with auth and navigation |
| `index.css`     | Global CSS styles (Tailwind directives)                     |
| `vite-env.d.ts` | Vite TypeScript environment declarations                    |

## Subdirectories

| Directory      | Purpose                                                                                   |
| -------------- | ----------------------------------------------------------------------------------------- |
| `collections/` | FireCMS collection definitions (Bytes, Nibbles, ByteSeries) - see `collections/AGENTS.md` |
| `components/`  | Custom field components - see `components/AGENTS.md`                                      |
| `hooks/`       | Custom React hooks - see `hooks/AGENTS.md`                                                |

## For AI Agents

### Working In This Directory

- `App.tsx` contains authentication logic and FireCMS setup
- Collections are registered in `App.tsx` via `useMemo`
- Firebase config is imported from `@bytes-and-nibbles/shared`
- Authentication restricts access based on email domain

### Common Patterns

- FireCMS hooks are used for controllers (auth, mode, navigation, storage)
- Collections array is memoized and passed to `useBuildNavigationController`
- Conditional rendering based on auth state

<!-- MANUAL: -->
