<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-08 | Updated: 2026-02-08 -->

# apps

## Purpose

Container directory for the two main applications in the monorepo: the CMS admin interface and the public-facing website.

## Subdirectories

| Directory  | Purpose                                                                |
| ---------- | ---------------------------------------------------------------------- |
| `cms/`     | FireCMS-based headless content management system - see `cms/AGENTS.md` |
| `website/` | Next.js public website that displays content - see `website/AGENTS.md` |

## For AI Agents

### Working In This Directory

- Each app is an independent pnpm workspace package
- Use `pnpm --filter <package-name>` to run commands in specific apps
- CMS package name: `bytes-and-nibbles-cms`
- Website package name: `bytes-and-nibbles-website`

### Architecture Overview

```
Content Flow:
CMS (create/edit) → Firebase Firestore → Website (read/display)
                  → Firebase Storage  →
```

- **CMS**: Write interface for content creators (authenticated users)
- **Website**: Read-only public interface for visitors

<!-- MANUAL: -->
