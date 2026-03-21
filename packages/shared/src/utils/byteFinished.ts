import type { ByteType } from "../types/bytes";
import {
  SECTION_BODY_ELEMENT_TYPES,
  SUBSECTION_BODY_ELEMENT_TYPES,
} from "../schemas/bytes";

/** Treat missing or non-true as unfinished (legacy documents). */
export function isNodeFinished(
  record: { is_finished?: boolean } | null | undefined,
): boolean {
  return record?.is_finished === true;
}

function paragraphMapFromValue(
  value: unknown,
): { paragraph?: string; is_finished?: boolean } | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") {
    return { paragraph: value };
  }
  if (typeof value === "object" && "paragraph" in (value as object)) {
    return value as { paragraph?: string; is_finished?: boolean };
  }
  return null;
}

function latexMapFromValue(
  value: unknown,
): { latexContent?: string; is_finished?: boolean } | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") {
    return { latexContent: value };
  }
  if (typeof value === "object" && "latexContent" in (value as object)) {
    return value as { latexContent?: string; is_finished?: boolean };
  }
  return null;
}

// Section and subsection body use the same `type` string literals; one map entry each.
const BLOCK_LABEL: Record<string, string> = {
  [SECTION_BODY_ELEMENT_TYPES.PARAGRAPH]: "Paragraph",
  [SECTION_BODY_ELEMENT_TYPES.LATEX_PARAGRAPH]: "LaTeX block",
  [SECTION_BODY_ELEMENT_TYPES.CAPTIONED_IMAGE]: "Captioned image",
  [SECTION_BODY_ELEMENT_TYPES.COLLAPSIBLE_GROUP]: "Collapsible group",
  [SECTION_BODY_ELEMENT_TYPES.SUBSECTION]: "Subsection",
  [SUBSECTION_BODY_ELEMENT_TYPES.SUBSUBSECTION]: "Subsubsection",
};

function labelForBlockType(type: string): string {
  return BLOCK_LABEL[type] ?? type;
}

function oneOfValue(el: object): unknown {
  return (el as unknown as { value?: unknown }).value;
}

function walkLeafish(
  pathParts: string[],
  type: string,
  value: unknown,
  out: string[],
): void {
  if (type === SUBSECTION_BODY_ELEMENT_TYPES.PARAGRAPH) {
    const m = paragraphMapFromValue(value);
    if (!isNodeFinished(m ?? undefined)) {
      out.push(pathParts.join(" → "));
    }
    return;
  }
  if (type === SUBSECTION_BODY_ELEMENT_TYPES.LATEX_PARAGRAPH) {
    const m = latexMapFromValue(value);
    if (!isNodeFinished(m ?? undefined)) {
      out.push(pathParts.join(" → "));
    }
    return;
  }
  if (type === SUBSECTION_BODY_ELEMENT_TYPES.CAPTIONED_IMAGE) {
    if (
      value &&
      typeof value === "object" &&
      !isNodeFinished(value as { is_finished?: boolean })
    ) {
      out.push(pathParts.join(" → "));
    }
    return;
  }
  if (type === SUBSECTION_BODY_ELEMENT_TYPES.COLLAPSIBLE_GROUP) {
    const g = value as {
      is_finished?: boolean;
      body?: unknown[];
    } | null;
    if (!isNodeFinished(g ?? undefined)) {
      out.push(pathParts.join(" → "));
    }
    const inner = Array.isArray(g?.body) ? g.body : [];
    inner.forEach((el, i) => {
      if (el && typeof el === "object" && "type" in el) {
        const t = (el as { type: string }).type;
        const v = oneOfValue(el);
        walkLeafish(
          [...pathParts, `${labelForBlockType(t)} ${i + 1}`],
          t,
          v,
          out,
        );
      }
    });
  }
}

function walkSubsubsectionBody(
  body: unknown[] | undefined,
  pathPrefix: string[],
  out: string[],
): void {
  if (!Array.isArray(body)) return;
  body.forEach((el, i) => {
    if (!el || typeof el !== "object" || !("type" in el)) return;
    const type = (el as { type: string }).type;
    const value = oneOfValue(el);
    walkLeafish(
      [...pathPrefix, `${labelForBlockType(type)} ${i + 1}`],
      type,
      value,
      out,
    );
  });
}

function walkSubsectionBody(
  body: unknown[] | undefined,
  pathPrefix: string[],
  out: string[],
): void {
  if (!Array.isArray(body)) return;
  body.forEach((el, i) => {
    if (!el || typeof el !== "object" || !("type" in el)) return;
    const type = (el as { type: string }).type;
    const value = oneOfValue(el);
    if (type === SUBSECTION_BODY_ELEMENT_TYPES.SUBSUBSECTION) {
      const sub = value as {
        title?: string;
        is_finished?: boolean;
        body?: unknown[];
      };
      const title = sub?.title?.trim() || `Subsubsection ${i + 1}`;
      if (!isNodeFinished(sub)) {
        out.push([...pathPrefix, title].join(" → "));
      }
      walkSubsubsectionBody(sub?.body, [...pathPrefix, title], out);
      return;
    }
    walkLeafish(
      [...pathPrefix, `${labelForBlockType(type)} ${i + 1}`],
      type,
      value,
      out,
    );
  });
}

function walkSectionBody(
  body: unknown[] | undefined,
  pathPrefix: string[],
  out: string[],
): void {
  if (!Array.isArray(body)) return;
  body.forEach((el, i) => {
    if (!el || typeof el !== "object" || !("type" in el)) return;
    const type = (el as { type: string }).type;
    const value = oneOfValue(el);
    if (type === SECTION_BODY_ELEMENT_TYPES.SUBSECTION) {
      const sub = value as {
        title?: string;
        is_finished?: boolean;
        body?: unknown[];
      };
      const title = sub?.title?.trim() || `Subsection ${i + 1}`;
      if (!isNodeFinished(sub)) {
        out.push([...pathPrefix, title].join(" → "));
      }
      walkSubsectionBody(sub?.body, [...pathPrefix, title], out);
      return;
    }
    walkLeafish(
      [...pathPrefix, `${labelForBlockType(type)} ${i + 1}`],
      type,
      value,
      out,
    );
  });
}

/**
 * Returns hierarchical paths to every unfinished content unit in a byte.
 * Used by the CMS publish gate; tolerates legacy paragraph/latex shapes.
 */
export function listUnfinishedByteUnitPaths(
  byte: Partial<ByteType> | Record<string, unknown>,
): string[] {
  const out: string[] = [];
  const sections = (byte as { sections?: unknown }).sections;
  if (!Array.isArray(sections)) return out;

  sections.forEach((section, si) => {
    if (!section || typeof section !== "object") return;
    const s = section as {
      title?: string;
      is_finished?: boolean;
      body?: unknown[];
    };
    const secTitle = s.title?.trim() || `Section ${si + 1}`;
    if (!isNodeFinished(s)) {
      out.push(secTitle);
    }
    walkSectionBody(s.body, [secTitle], out);
  });

  return out;
}

type OneOfMark = { type?: string; value?: unknown };

function paragraphValueMarkFinished(value: unknown): Record<string, unknown> {
  if (typeof value === "string") {
    return { paragraph: value, is_finished: true };
  }
  if (value && typeof value === "object") {
    return { ...(value as object), is_finished: true } as Record<
      string,
      unknown
    >;
  }
  return { paragraph: "", is_finished: true };
}

function latexValueMarkFinished(value: unknown): Record<string, unknown> {
  if (typeof value === "string") {
    return { latexContent: value, is_finished: true };
  }
  if (value && typeof value === "object") {
    return { ...(value as object), is_finished: true } as Record<
      string,
      unknown
    >;
  }
  return { latexContent: "", is_finished: true };
}

function markLeafishElement(el: OneOfMark): void {
  const t = el.type;
  const v = el.value;
  if (
    t === SUBSECTION_BODY_ELEMENT_TYPES.PARAGRAPH ||
    t === SECTION_BODY_ELEMENT_TYPES.PARAGRAPH
  ) {
    el.value = paragraphValueMarkFinished(v);
    return;
  }
  if (
    t === SUBSECTION_BODY_ELEMENT_TYPES.LATEX_PARAGRAPH ||
    t === SECTION_BODY_ELEMENT_TYPES.LATEX_PARAGRAPH
  ) {
    el.value = latexValueMarkFinished(v);
    return;
  }
  if (
    t === SUBSECTION_BODY_ELEMENT_TYPES.CAPTIONED_IMAGE ||
    t === SECTION_BODY_ELEMENT_TYPES.CAPTIONED_IMAGE
  ) {
    if (v && typeof v === "object") {
      (v as { is_finished?: boolean }).is_finished = true;
    } else {
      el.value = { is_finished: true };
    }
    return;
  }
  if (
    t === SUBSECTION_BODY_ELEMENT_TYPES.COLLAPSIBLE_GROUP ||
    t === SECTION_BODY_ELEMENT_TYPES.COLLAPSIBLE_GROUP
  ) {
    let g: { is_finished?: boolean; body?: unknown[] };
    if (v && typeof v === "object") {
      g = v as { is_finished?: boolean; body?: unknown[] };
    } else {
      g = { body: [] };
      el.value = g;
    }
    g.is_finished = true;
    if (!Array.isArray(g.body)) g.body = [];
    for (const inner of g.body) {
      if (inner && typeof inner === "object" && "type" in inner) {
        markLeafishElement(inner as OneOfMark);
      }
    }
  }
}

function markSubsubsectionBody(body: unknown[] | undefined): void {
  if (!Array.isArray(body)) return;
  for (const raw of body) {
    if (raw && typeof raw === "object" && "type" in raw) {
      markLeafishElement(raw as OneOfMark);
    }
  }
}

function markSubsectionBody(body: unknown[] | undefined): void {
  if (!Array.isArray(body)) return;
  for (const raw of body) {
    if (!raw || typeof raw !== "object" || !("type" in raw)) continue;
    const el = raw as OneOfMark;
    const t = el.type;
    const v = el.value;
    if (t === SUBSECTION_BODY_ELEMENT_TYPES.SUBSUBSECTION) {
      let sub: { is_finished?: boolean; body?: unknown[] };
      if (v && typeof v === "object") {
        sub = v as { is_finished?: boolean; body?: unknown[] };
      } else {
        sub = { body: [] };
        el.value = sub;
      }
      sub.is_finished = true;
      if (!Array.isArray(sub.body)) sub.body = [];
      markSubsubsectionBody(sub.body);
      continue;
    }
    markLeafishElement(el);
  }
}

function markSectionBody(body: unknown[] | undefined): void {
  if (!Array.isArray(body)) return;
  for (const raw of body) {
    if (!raw || typeof raw !== "object" || !("type" in raw)) continue;
    const el = raw as OneOfMark;
    const t = el.type;
    const v = el.value;
    if (t === SECTION_BODY_ELEMENT_TYPES.SUBSECTION) {
      let sub: { is_finished?: boolean; body?: unknown[] };
      if (v && typeof v === "object") {
        sub = v as { is_finished?: boolean; body?: unknown[] };
      } else {
        sub = { body: [] };
        el.value = sub;
      }
      sub.is_finished = true;
      if (!Array.isArray(sub.body)) sub.body = [];
      markSubsectionBody(sub.body);
      continue;
    }
    markLeafishElement(el);
  }
}

/**
 * Sets `is_finished: true` on every section, subsection, block, and leaf map in
 * `byte.sections`. Mutates the given object (pass a clone if immutability is required).
 * Used by the CMS "mark all finished" action.
 */
export function markAllByteUnitsFinished(
  byte: Partial<ByteType> | Record<string, unknown>,
): void {
  const sections = (byte as { sections?: unknown }).sections;
  if (!Array.isArray(sections)) return;
  for (const section of sections) {
    if (!section || typeof section !== "object") continue;
    const s = section as { is_finished?: boolean; body?: unknown[] };
    s.is_finished = true;
    if (!Array.isArray(s.body)) s.body = [];
    markSectionBody(s.body);
  }
}

const DEFAULT_PUBLISH_ERROR_PATH_PREVIEW_COUNT = 5;

export function formatUnfinishedBytePathsForPublishError(
  paths: string[],
  maxPreview = DEFAULT_PUBLISH_ERROR_PATH_PREVIEW_COUNT,
): string {
  if (paths.length === 0) {
    return "Cannot publish: unfinished content units must be marked finished first.";
  }

  const shown = paths.slice(0, Math.max(0, maxPreview));
  const remaining = paths.length - shown.length;

  const lines = [
    "Cannot publish until these units are marked finished:",
    "",
    ...shown.map((p) => `• ${p}`),
  ];

  if (remaining > 0) {
    lines.push("", `+${remaining} more`);
  }

  return lines.join("\n");
}
