# Masterplan Document Template

Follow this structure when writing the masterplan. Replace all `{placeholder}` values with synthesised content.

---

# Masterplan: {Title}

> {One-paragraph executive summary of the product vision, synthesised from the aggregate of all tickets and initiatives. Should stand alone as a TL;DR.}

## How to Use This Document

This masterplan describes the desired state of the product. It is intentionally
status-agnostic — it does not indicate whether features have been implemented,
are in progress, or are yet to be started. When implementing any feature,
reference this document to understand how your work fits into the broader
product vision. Do not update this document to reflect implementation progress.

## Metadata

- **Generated**: {YYYY-MM-DD_HH-MM-SS}
- **Last refreshed**: {YYYY-MM-DD_HH-MM-SS or "—"}
- **Scope**: {human-readable description, e.g., "Copilot team — backlog, to-do, and in-progress tickets"}
- **Tickets analysed**: {count}

### Criteria

```
team: {team name or "all"}
project: {project name or "all"}
states: backlog, unstarted, started
labels: {comma-separated or "none"}
priority: {1-4 or "any"}
assignee: {name or "any"}
```

## Product Vision

{2-3 paragraphs synthesising the overall product direction. What is this
product? Who is it for? What problems does it solve? What is the strategic
trajectory? Derived from initiatives, projects, and the aggregate of all
tickets.}

## Feature Areas

### {Area Name}

{Paragraph describing this feature area, its purpose, and its value to users.}

- **{Capability}**: {Description of desired behaviour — present tense}
- **{Capability}**: {Description of desired behaviour}

{Repeat for 4-10 feature areas, depending on scope.}

## Cross-Cutting Concerns

### {Concern, e.g., Performance}

{Description of requirements that span multiple feature areas.}

### {Concern, e.g., Security}

{Description of cross-cutting requirements.}

## Feature Relationships

{Describe how feature areas relate to, depend on, or enable each other.
This helps an AI understand integration points when implementing any
single feature.}

## Strategic Context

{High-level strategic themes from Linear initiatives and how the feature
areas map to them. Provides the "why behind the why" for individual
features. Omit this section if no initiatives exist in Linear.}

---

## Section Guidance

| Section                | Purpose                         | Notes                                             |
| ---------------------- | ------------------------------- | ------------------------------------------------- |
| Executive summary      | One-paragraph product brief     | Should stand alone as a TL;DR                     |
| How to Use             | Instructs AI on document intent | Include verbatim — do not modify                  |
| Metadata / Criteria    | Enable refresh mode             | Criteria block must preserve the exact key format |
| Product Vision         | Strategic context               | Derived from initiatives + aggregate tickets      |
| Feature Areas          | Core of the masterplan          | 4-10 areas, synthesised from related tickets      |
| Cross-Cutting Concerns | Spanning requirements           | Performance, security, accessibility, etc.        |
| Feature Relationships  | Integration context             | Helps AI understand sequencing and dependencies   |
| Strategic Context      | Initiative-level framing        | Only include if initiatives exist in Linear       |
