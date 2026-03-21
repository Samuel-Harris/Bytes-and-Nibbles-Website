/**
 * Legacy Firestore bytes sometimes store paragraph / LaTeX oneOf `value` as a raw
 * string. FireCMS expects a map (`{ paragraph }` / `{ latexContent }`, plus
 * optional `is_finished`). This module coerces those shapes in place when a byte
 * is loaded (`v1_bytes` `onFetch`) so the form and publish-finished walk behave
 * correctly. Saving can persist the normalized map back to Firestore.
 */
import {
  SECTION_BODY_ELEMENT_TYPES,
  SUBSECTION_BODY_ELEMENT_TYPES,
} from "@bytes-and-nibbles/shared";

type OneOfItem = { type?: string; value?: unknown };

/** String → `{ paragraph }`; objects are shallow-cloned. */
function normalizeParagraphValue(value: unknown): Record<string, unknown> {
  if (typeof value === "string") {
    return { paragraph: value };
  }
  if (value && typeof value === "object") {
    return { ...(value as object) } as Record<string, unknown>;
  }
  return { paragraph: "" };
}

/** String → `{ latexContent }`; objects are shallow-cloned. */
function normalizeLatexValue(value: unknown): Record<string, unknown> {
  if (typeof value === "string") {
    return { latexContent: value };
  }
  if (value && typeof value === "object") {
    return { ...(value as object) } as Record<string, unknown>;
  }
  return { latexContent: "" };
}

/** Walk section/subsection/collapsible bodies and normalize paragraph/latex values. */
function normalizeOneOfArray(items: unknown[] | undefined): void {
  if (!Array.isArray(items)) return;
  for (const raw of items) {
    if (!raw || typeof raw !== "object" || !("type" in raw)) continue;
    const el = raw as OneOfItem;
    const t = el.type;
    if (
      t === SUBSECTION_BODY_ELEMENT_TYPES.PARAGRAPH ||
      t === SECTION_BODY_ELEMENT_TYPES.PARAGRAPH
    ) {
      el.value = normalizeParagraphValue(el.value);
    } else if (
      t === SUBSECTION_BODY_ELEMENT_TYPES.LATEX_PARAGRAPH ||
      t === SECTION_BODY_ELEMENT_TYPES.LATEX_PARAGRAPH
    ) {
      el.value = normalizeLatexValue(el.value);
    } else if (
      t === SUBSECTION_BODY_ELEMENT_TYPES.COLLAPSIBLE_GROUP ||
      t === SECTION_BODY_ELEMENT_TYPES.COLLAPSIBLE_GROUP
    ) {
      const g = el.value as { body?: unknown[] } | undefined;
      normalizeOneOfArray(g?.body);
    } else if (t === SUBSECTION_BODY_ELEMENT_TYPES.SUBSUBSECTION) {
      const sub = el.value as { body?: unknown[] } | undefined;
      normalizeOneOfArray(sub?.body);
    } else if (t === SECTION_BODY_ELEMENT_TYPES.SUBSECTION) {
      const sub = el.value as { body?: unknown[] } | undefined;
      normalizeOneOfArray(sub?.body);
    }
  }
}

/** Mutates `values.sections` in place (entity.values from `onFetch`). */
export function normalizeByteSectionsForCmsForm(
  values: Record<string, unknown>,
): void {
  const sections = values.sections;
  if (!Array.isArray(sections)) return;
  for (const section of sections) {
    if (!section || typeof section !== "object") continue;
    const s = section as { body?: unknown[] };
    normalizeOneOfArray(s.body);
  }
}
