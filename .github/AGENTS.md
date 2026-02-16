<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-08 | Updated: 2026-02-16 -->

# .github

## Purpose

GitHub-specific configuration including CI/CD workflows and pull request templates.

## Key Files

| File                       | Description                            |
| -------------------------- | -------------------------------------- |
| `pull_request_template.md` | Template for pull request descriptions |

## Subdirectories

| Directory    | Purpose                                                         |
| ------------ | --------------------------------------------------------------- |
| `workflows/` | GitHub Actions workflow definitions - see `workflows/AGENTS.md` |

## For AI Agents

### Working In This Directory

- Workflow files use YAML format
- Secrets are referenced as `${{ secrets.SECRET_NAME }}`
- Firebase service account secret: `FIREBASE_SERVICE_ACCOUNT_BYTES_AND_NIBBLES`

<!-- MANUAL: -->
