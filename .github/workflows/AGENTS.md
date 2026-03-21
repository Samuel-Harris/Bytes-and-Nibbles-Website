<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-08 | Updated: 2026-03-21 -->

# workflows

## Purpose

GitHub Actions workflow definitions for continuous integration and deployment.

## Key Files

| File         | Description                                                                |
| ------------ | -------------------------------------------------------------------------- |
| `ci.yml`     | CI workflow: tests, lint, unused-deps check, build, and Firebase preview on PRs |
| `deploy.yml` | Production deployment workflow (triggered on main branch)                  |

## For AI Agents

### Working In This Directory

- CI workflow runs on pull requests to `main`
- Uses path filters to only run when relevant files change
- Node.js v24 and pnpm v10 are used
- Firebase preview deployments require service account secret

### Workflow Details

**CI Workflow (`ci.yml`)**:

1. **changes** job: Detects which parts of the codebase changed
2. **test** job: Runs `pnpm test` across all packages
3. **lint** job: Runs `pnpm lint` across all packages
4. **unused_dependencies** job: Runs `pnpm check:unused-deps` (Knip, manifest vs usage per workspace package)
5. **build_and_preview** job: Builds and deploys preview to Firebase Hosting

**Deploy Workflow (`deploy.yml`)**:

- Triggers on push to `main` branch and on manual **Run workflow** (`workflow_dispatch`)
- Deploys production build to Firebase Hosting

### Path Filters

| Filter    | Paths                                                                         |
| --------- | ----------------------------------------------------------------------------- |
| `all`     | `packages/shared/**`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml` |
| `cms`     | `apps/cms/**`                                                                 |
| `website` | `apps/website/**`                                                             |
| `dep_audit` | Workspace manifests, lockfile, workspace config, and `knip.jsonc` (runs unused-deps with test/lint when those paths change) |

<!-- MANUAL: -->
