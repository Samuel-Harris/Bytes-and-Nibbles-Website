<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-30 | Updated: 2026-08-30 -->

# .agents

## Purpose

Portable agent skills used by GitHub Copilot, Cursor, and other coding agents. These live outside `.cursor/` so they are not Cursor-only.

## Subdirectories

| Directory | Purpose                                              |
| --------- | ---------------------------------------------------- |
| `skills/` | Agent skill definitions - see `skills/AGENTS.md`     |

## For AI Agents

### Working In This Directory

- Add a skill here when it should work across agents, not only in Cursor
- Cursor-specific skills still belong in `.cursor/skills/`
- Follow the `SKILL.md` format (YAML frontmatter with `name` and `description`, then the procedure)

<!-- MANUAL: -->
