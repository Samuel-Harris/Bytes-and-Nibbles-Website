<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-08 | Updated: 2026-03-21 -->

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

### Pull request hygiene

- Prefer **separate pull requests** for large Cursor or editor-only churn (for example `.cursor/`, `.vscode` workspace defaults, `.cursorindexingignore`) versus product or content-model changes, so review and revert stay scoped.
- When Cursor tooling was split off the feature branch, a git branch `pre-split/cursor-tooling-snapshot` was created at the last commit that still contained those paths. **Push that branch to origin** and open a follow-up PR onto `main` after the product PR lands (for example: check out `main`, create a branch, then `git checkout pre-split/cursor-tooling-snapshot -- .cursor .cursorindexingignore .vscode` and adjust `.gitignore` if the team wants `.cursor/` tracked).

<!-- MANUAL: -->
