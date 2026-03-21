---
name: enrich-linear-ticket-description
description: >-
  Prepares a Linear issue for another agent: interviews only when needed, updates
  the description with behavior-first context, and stops—never implements the
  ticket itself. Use when refining handoff for CODE-* issues, syncing
  product intent to Linear, or when the user says "interview me about this
  ticket" / "update Linear for an implementer".
---

# Ticket interview and Linear update (behavior-first)

Elicit **intended behavior** from the developer when needed, then write it into the Linear issue. The ticket text is the **handoff contract** for a **different** implementation agent.

## Mandatory boundaries

- **Do not implement this ticket** while running this skill. No code changes, no refactors, no tests, no PRs, no “I went ahead and built it.” **Stop** after assessment, interview (if any), and Linear update—or after reporting that no update is needed.
- **Interview is optional.** After reading the issue (and the user’s message), if the description **already** has enough **behavior**, **scope**, and **acceptance criteria** for another agent to execute, **say so** and **skip the interview**. Optionally apply a light edit for clarity or behavior-first wording **only if** the user asked for a Linear update or the ticket still mixes in unwarranted implementation detail. Otherwise exit with a short readiness summary and the issue link.

## When to use vs skip this skill entirely

| Use this skill | Skip this skill (use another workflow) |
| -------------- | ---------------------------------------- |
| You are **preparing** or **tightening** a Linear issue for a **future implementer** | The user wants **you** to implement now—use normal implementation, not this skill |
| Ticket is vague, missing ACs, or needs behavior-first cleanup on Linear | No Linear issue ID and the user does not want Linear updated |
| You need durable, shared spec **on the issue** for humans and agents | — |

## Core rules

### 1. Behavior on Linear, implementation only by exception

**Linear description MUST emphasize:**

- **Actors and context** (who does what, in which app or surface).
- **Triggers and state changes** (e.g. "when the user enables X, then Y must happen").
- **Rules and invariants** at product level (e.g. "every A must be B before C is allowed").
- **User-visible outcomes** (what they see, what is blocked, what messages convey—**intent** of the copy, not final marketing polish unless specified).
- **Scope and non-goals** (what is explicitly out of scope for this issue).
- **Acceptance criteria** as **testable behaviors** (checkbox list), not file edits.

**Do NOT put on Linear unless the developer explicitly asked for it:**

- File paths, module names, function names, or "edit `…`".
- Libraries, frameworks, algorithms, or patterns (e.g. "use React", "k-NN", "add a Zod schema") **unless** the developer stated that constraint verbatim or clearly mandated it for this issue.
- Internal refactors, code style, or tech-debt plans unless the issue is explicitly about those.

If the developer volunteers implementation constraints, add a dedicated section (see template) so agents treat them as **hard requirements**, not inferred stack defaults.

### 2. Brownfield context without prescribing edits

In **brownfield** repos, you may use a short **"Product / system context (read-only)"** subsection: neutral facts like "Bytes are edited in the CMS and shown on the public site" **only** to disambiguate behavior. Do **not** turn that into a file-level implementation checklist on Linear.

Deeper technical mapping (paths, existing hooks) belongs in **repo exploration by the implementer**, not in the ticket—unless the developer explicitly required a specific location or approach.

### 3. Interview discipline

- Ask **one question at a time** unless the user explicitly requests a batch.
- Prefer **multiple-choice with a free-text escape** when it speeds alignment.
- Target the **largest remaining gap** first: scope boundaries, failure modes, and "what happens when…" usually beat feature brainstorming.
- After each answer, briefly state what is now **locked** vs **still open** so the developer can correct you early.

Optional: reuse the ambiguity dimensions from `.cursor/skills/deep-interview/SKILL.md` (goal, constraints, success criteria, context) **without** requiring numeric scoring unless the user wants that rigor.

### 4. User-visible issue identity

Whenever you refer to the issue **to the user** (kickoff, each interview round, confirmations, final handoff), include **both**:

1. The **issue identifier** (e.g. `CODE-2`, `LIN-123`), and  
2. The **title** returned by `get_issue`.

**Example:** `CODE-2 — Add finished/unfinished flag to CMS`

The user may have only pasted an ID; the title is what ties the conversation to the right work. **Do not** rely on the ID alone in user-facing text.

## Workflow

1. **Identify the issue**  
   Confirm Linear **issue id** (e.g. `CODE-2`) and read **title** and description via Linear MCP (`get_issue`) when updating Linear. Read the MCP tool schema under the workspace `mcps` folder before calling tools. **Retain the title** for every user-visible mention of this issue (see **User-visible issue identity**).

2. **Assess: interview needed?**  
   Judge whether the issue **already** satisfies a behavior-first handoff (summary, rules/outcomes, scope/non-goals, testable ACs). If **yes**, tell the user the ticket looks **ready for an implementer**, **skip steps 3–4**, then either go to **step 7** (no description change) or **steps 5–7** if a **small** Linear polish is still warranted (e.g. user asked to normalize wording or strip speculative implementation). If **no**, continue.

3. **Classify**  
   Greenfield vs brownfield. If brownfield and the ticket touches existing product behavior, do a **light** codebase pass (search or `explore` subagent) so questions are informed—**do not** paste exploration results wholesale into Linear unless they are product facts (e.g. "there are two content types: bytes and nibbles").

4. **Interview (only if step 2 said gaps remain)**  
   Drive questions until behavior, scope, success/failure behavior, and explicit implementation constraints (if any) are clear enough that an agent could write tests from the ticket alone.

5. **Draft the Linear body**  
   Use the template below. Strip implementation fluff. Merge with any **developer-mandated** technical constraints in the optional section.

6. **Update Linear (if there is something to change)**  
   Call `save_issue` with `id` and new `description` (Markdown) only when the body **should** change. Do not change `title` unless the developer asked. Preserve existing attachments; note that link attachments are often append-only in MCP—do not rely on removing old links via the tool. If no edit is needed, do not call `save_issue` for the sake of it.

7. **Confirm (and stop)**  
   Reply with **`{id} — {title}`**, the **issue URL**, and a short summary: either **what was added/changed for implementers** or **why the ticket was left unchanged**. **Do not** start implementation.

## Linear description template

Use headings similar to this (adapt labels to the work; omit empty sections).

```markdown
## Summary

[One short paragraph: outcome-oriented, no stack.]

## Actors & surfaces

[Who interacts; which product areas (e.g. CMS vs public site).]

## Intended behavior

- **When** … **then** …
- **Rules** … (invariants, ordering, defaults)
- **Edge cases** … (empty states, legacy data, permission failures—behavior only)

## Out of scope

- …

## Acceptance criteria

- [ ] …
- [ ] …

## Explicit implementation constraints (only if mandated by developer)

[Libraries, algorithms, services, or file/area the developer required. If empty, omit this section entirely.]

## Notes for implementers

[Optional: non-prescriptive reminders—e.g. "Field name in production data is `isPublished`" if that is a **domain** name, not a path. Prefer domain language over repo structure.]
```

## Anti-patterns

- **ID-only references**: Mentioning only the issue id (e.g. `CODE-2`) to the user without the **title**—**avoid**; they may not remember which ticket that is (see **User-visible issue identity**).
- **Implementing in the same session**: Building the feature, editing app code, or “finishing” the ticket after updating Linear—**forbidden** for this skill’s caller.
- **Forced interview**: Asking rounds of questions when the Linear issue is already sufficient—**unnecessary**; assess first (workflow step 2).
- **Speculative stack**: "Use Firestore rules" / "add Zod" on the ticket without the developer asking → **remove** or move to questions.
- **Duplicate deep-interview artifact**: Do not require a local interview file unless the user wants it; Linear is the source of truth for agents that start from the issue.
- **Wall of codebase dump**: Pasting directory trees or ten file paths **obscures** behavior-first handoff—avoid.

## Example contrast

| Avoid on Linear                                      | Prefer on Linear                                                                                                     |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| "Add `is_finished` in `v1_bytes.tsx` and `bytes.ts`" | "Every block in the byte article tree has `is_finished` (default false), persisted with the document."               |
| "Use `onPreSave` to validate"                        | "When the user tries to publish, block the save if any tracked unit is unfinished; show which units are unfinished." |
| "Use React state for toggles"                        | "Editors can mark each unit finished or not; default unfinished."                                                    |

---

If the user also wants a **local transcript** (Q&A + scores), run the **deep-interview** skill or append a short "## Interview transcript" section in a repo doc **only when they ask**—keep Linear itself behavior-first.
