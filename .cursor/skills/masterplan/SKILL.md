---
name: masterplan
description: Generate a holistic product vision from Linear tickets. Pulls backlog, to-do, and in-progress tickets and synthesises them into a status-agnostic overview. Use when starting a new feature to understand the bigger picture, onboarding to the project, or when AI needs context on long-term goals. Supports refreshing existing masterplans with latest data.
---

# Masterplan Generator

Synthesise Linear tickets into a status-agnostic product vision. The masterplan describes WHAT the product should do and WHY — never whether features are done, in progress, or planned. This keeps the document useful across implementation sessions without confusing AI agents about current state.

## Modes

| Mode         | Trigger                                         | Action                                                                    |
| ------------ | ----------------------------------------------- | ------------------------------------------------------------------------- |
| **Generate** | "generate a masterplan", "create a masterplan"  | Full pipeline: scope → fetch → synthesise → write                         |
| **Refresh**  | "refresh the masterplan", path to existing file | Re-fetch tickets using stored criteria, re-synthesise, overwrite in place |

## Phase 1: Determine Scope

### If criteria were provided

Use them directly. Valid criteria: team, project, label, priority, assignee, cycle, or search query.

### If no criteria were provided

Gather scope using `AskQuestion`. First call `list_teams` and `list_projects` (Linear MCP, server: `user-Linear`) in parallel to populate options dynamically:

- "Entire workspace (all teams)"
- One option per team (e.g., "Copilot team only")
- One option per active project (e.g., "Project: Patent Drafting")
- "Let me describe the scope" — free text

### Default state filter

Unless the user explicitly overrides, include only these Linear state types:

| State       | Linear state type |
| ----------- | ----------------- |
| Backlog     | `backlog`         |
| To-do       | `unstarted`       |
| In Progress | `started`         |

### Ambiguity check

If the user's scope description is genuinely ambiguous (not just missing filter values), read and invoke the deep-interview skill at `.cursor/skills/deep-interview/SKILL.md`.

**Needs deep-interview:** "masterplan for the AI stuff", "masterplan for next quarter's priorities"
**Does not:** "masterplan", "masterplan for the Copilot team", "masterplan for project Alpha"

## Phase 2: Confirm Filters

Before fetching, present the resolved filters to the user for confirmation. Generating a masterplan is expensive (many API calls + synthesis), so the filters must be correct.

Display a summary and ask for approval via `AskQuestion`:

```
I'll pull tickets with these filters:

- **Team**: {team or "all teams"}
- **Project**: {project or "all projects"}
- **States**: Backlog, To-do, In Progress
- **Labels**: {labels or "none"}
- **Priority**: {priority or "any"}
- **Assignee**: {assignee or "any"}
```

Options: "Looks good — proceed", "Adjust filters" (loop back to Phase 1).

## Phase 3: Fetch from Linear

Use the Linear MCP server (server: `user-Linear`). Run calls in parallel where possible.

### 3a: Fetch issues

`list_issues` accepts only one `state` per call. Make three parallel calls:

1. `list_issues` — `state: "backlog"`, `limit: 250`, `includeArchived: false` + user filters
2. `list_issues` — `state: "unstarted"`, `limit: 250`, `includeArchived: false` + user filters
3. `list_issues` — `state: "started"`, `limit: 250`, `includeArchived: false` + user filters

If any call returns a `cursor`, paginate until exhausted. Merge and deduplicate by issue ID.

If state type strings are rejected, fall back: call `list_issue_statuses` for the relevant team to discover actual state names/IDs, then re-query.

### 3b: Fetch strategic context (parallel with 3a)

4. `list_initiatives` — `includeProjects: true`, `includeSubInitiatives: true`
5. `list_projects` — `includeMilestones: true`

### 3c: Enrich epics (optional)

For issues that appear to be parent issues or epics, call `get_issue` with `includeRelations: true` to capture full scope.

## Phase 4: Synthesise

### Grouping

1. **Identify themes** — group tickets into functional feature areas. Use project names and labels as hints but synthesise across project boundaries.
2. **Identify cross-cutting concerns** — requirements spanning multiple areas (performance, security, accessibility).
3. **Identify dependencies** — features that depend on or enable other features.

### Writing rules

| Rule               | Detail                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| Status-agnostic    | Present tense: "The system supports X", "Users can Y". NEVER "planned", "not yet implemented", "to be built". |
| No ticket metadata | No Linear IDs, statuses, assignees, priorities, or dates.                                                     |
| Synthesise         | Combine related tickets into coherent feature descriptions — don't list them individually.                    |
| Preserve intent    | Capture WHY behind features, not just WHAT.                                                                   |
| Domain language    | Mirror terminology from the tickets.                                                                          |
| Concise            | Target 200–500 lines total. Dense and useful, not exhaustive.                                                 |

## Phase 5: Write

1. Run `date '+%Y-%m-%d_%H-%M-%S'` to get the timestamp.
2. Ask the user for a short description slug (2–4 words, kebab-case) or derive one from scope.
3. `mkdir -p .cursor/masterplans`
4. Save to `.cursor/masterplans/{timestamp}_{description}_masterplan.md`

Read the template at [references/masterplan-template.md](references/masterplan-template.md) and fill in all sections.

The metadata section **must** include a `Criteria` block so the refresh mode can re-use the same filters. See the template for format.

## Phase 6: Present

1. Display the saved file path.
2. Summarise: ticket count, feature area count, key themes.
3. Suggest usage:

> Attach this masterplan as context when implementing features:
> `.cursor/masterplans/{filename}`

4. Ask if the user wants to adjust any section.

## Refresh Mode

When the user asks to refresh an existing masterplan:

1. **Locate**: Use the path the user provided, or find the most recent `*_masterplan.md` in `.cursor/masterplans/`.
2. **Parse criteria**: Read the `Criteria` block from the metadata section.
3. **Confirm filters** (Phase 2) — show the parsed criteria and ask the user to approve or adjust.
4. **Re-run Phase 3** (Fetch) with the confirmed criteria.
5. **Re-run Phase 4** (Synthesise) with fresh data.
6. **Overwrite** the existing file. Update `Generated` to the current timestamp and set `Last refreshed`. Keep the same filename.
7. **Inform the user**: report new ticket count vs. previous, and flag any new or removed feature areas.

If criteria cannot be parsed, ask the user to confirm scope before proceeding.

## Edge Cases

| Case                        | Action                                                   |
| --------------------------- | -------------------------------------------------------- |
| 0 tickets found             | Inform user, suggest broadening criteria                 |
| 500+ tickets                | Warn output will be high-level, offer to narrow scope    |
| Linear MCP unavailable      | Stop and inform user — do not generate without data      |
| State type strings rejected | Fall back to `list_issue_statuses` to discover names/IDs |
