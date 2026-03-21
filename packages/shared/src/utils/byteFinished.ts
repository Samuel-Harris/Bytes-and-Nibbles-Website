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

const BLOCK_LABEL: Record<string, string> = {
  [SECTION_BODY_ELEMENT_TYPES.PARAGRAPH]: "Paragraph",
  [SECTION_BODY_ELEMENT_TYPES.LATEX_PARAGRAPH]: "LaTeX block",
  [SECTION_BODY_ELEMENT_TYPES.CAPTIONED_IMAGE]: "Captioned image",
  [SECTION_BODY_ELEMENT_TYPES.COLLAPSIBLE_GROUP]: "Collapsible group",
  [SECTION_BODY_ELEMENT_TYPES.SUBSECTION]: "Subsection",
  [SUBSECTION_BODY_ELEMENT_TYPES.PARAGRAPH]: "Paragraph",
  [SUBSECTION_BODY_ELEMENT_TYPES.LATEX_PARAGRAPH]: "LaTeX block",
  [SUBSECTION_BODY_ELEMENT_TYPES.CAPTIONED_IMAGE]: "Captioned image",
  [SUBSECTION_BODY_ELEMENT_TYPES.COLLAPSIBLE_GROUP]: "Collapsible group",
  [SUBSECTION_BODY_ELEMENT_TYPES.SUBSUBSECTION]: "Subsubsection",
};

function labelForBlockType(type: string): string {
  return BLOCK_LABEL[type] ?? type;
}

function recordUnfinished(pathParts: string[], out: string[]): void {
  out.push(pathParts.join(" → "));
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
      recordUnfinished(pathParts, out);
    }
    return;
  }
  if (type === SUBSECTION_BODY_ELEMENT_TYPES.LATEX_PARAGRAPH) {
    const m = latexMapFromValue(value);
    if (!isNodeFinished(m ?? undefined)) {
      recordUnfinished(pathParts, out);
    }
    return;
  }
  if (type === SUBSECTION_BODY_ELEMENT_TYPES.CAPTIONED_IMAGE) {
    if (
      value &&
      typeof value === "object" &&
      !isNodeFinished(value as { is_finished?: boolean })
    ) {
      recordUnfinished(pathParts, out);
    }
    return;
  }
  if (type === SUBSECTION_BODY_ELEMENT_TYPES.COLLAPSIBLE_GROUP) {
    const g = value as {
      is_finished?: boolean;
      body?: unknown[];
    } | null;
    if (!isNodeFinished(g ?? undefined)) {
      recordUnfinished(pathParts, out);
    }
    const inner = Array.isArray(g?.body) ? g.body : [];
    inner.forEach((el, i) => {
      if (el && typeof el === "object" && "type" in el) {
        const t = (el as { type: string }).type;
        const v = (el as { value: unknown }).value;
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
    const value = (el as { value: unknown }).value;
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
    const value = (el as { value: unknown }).value;
    if (type === SUBSECTION_BODY_ELEMENT_TYPES.SUBSUBSECTION) {
      const sub = value as {
        title?: string;
        is_finished?: boolean;
        body?: unknown[];
      };
      const title = sub?.title?.trim() || `Subsubsection ${i + 1}`;
      if (!isNodeFinished(sub)) {
        recordUnfinished([...pathPrefix, title], out);
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
    const value = (el as { value: unknown }).value;
    if (type === SECTION_BODY_ELEMENT_TYPES.SUBSECTION) {
      const sub = value as {
        title?: string;
        is_finished?: boolean;
        body?: unknown[];
      };
      const title = sub?.title?.trim() || `Subsection ${i + 1}`;
      if (!isNodeFinished(sub)) {
        recordUnfinished([...pathPrefix, title], out);
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
      recordUnfinished([secTitle], out);
    }
    walkSectionBody(s.body, [secTitle], out);
  });

  return out;
}
