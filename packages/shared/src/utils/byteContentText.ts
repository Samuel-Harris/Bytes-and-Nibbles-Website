export function getParagraphText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && "paragraph" in (value as object)) {
    const p = (value as { paragraph?: unknown }).paragraph;
    return typeof p === "string" ? p : "";
  }
  return "";
}

export function getLatexText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && "latexContent" in (value as object)) {
    const p = (value as { latexContent?: unknown }).latexContent;
    return typeof p === "string" ? p : "";
  }
  return "";
}
