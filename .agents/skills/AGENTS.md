<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-30 | Updated: 2026-08-30 -->

# skills

## Purpose

Agent skill folders. Each skill is a directory containing a `SKILL.md` that tells coding agents when and how to perform a workflow.

## Subdirectories

| Directory   | Purpose                                                                 |
| ----------- | ----------------------------------------------------------------------- |
| `gh-stack/` | GitHub CLI stacked PR workflow (`gh stack`) - see `gh-stack/SKILL.md`   |

## For AI Agents

### Working In This Directory

- Use the `gh-stack` skill for stacked branches and stacked pull requests
- Keep each skill in its own folder with a `SKILL.md` entrypoint
- Do not run `gh stack` commands interactively; always pass the flags the skill requires (`--json`, `--auto`, explicit branch names)

<!-- MANUAL: -->
