import { describe, expect, it } from "vitest";
import { getLatexText, getParagraphText } from "./byteContentText";

describe("getParagraphText", () => {
  it("returns empty string for nullish", () => {
    expect(getParagraphText(null)).toBe("");
    expect(getParagraphText(undefined)).toBe("");
  });

  it("returns legacy string values as-is", () => {
    expect(getParagraphText("hello")).toBe("hello");
  });

  it("reads paragraph from map-shaped CMS/Firestore values", () => {
    expect(
      getParagraphText({ paragraph: "body", is_finished: true }),
    ).toBe("body");
  });

  it("returns empty when paragraph field is missing or not a string", () => {
    expect(getParagraphText({})).toBe("");
    expect(getParagraphText({ paragraph: 1 })).toBe("");
  });

  it("returns empty for unsupported shapes", () => {
    expect(getParagraphText(42)).toBe("");
    expect(getParagraphText({ latexContent: "x" })).toBe("");
  });
});

describe("getLatexText", () => {
  it("returns empty string for nullish", () => {
    expect(getLatexText(null)).toBe("");
    expect(getLatexText(undefined)).toBe("");
  });

  it("returns legacy string values as-is", () => {
    expect(getLatexText("E = mc^2")).toBe("E = mc^2");
  });

  it("reads latexContent from map-shaped values", () => {
    expect(
      getLatexText({ latexContent: "\\pi", is_finished: false }),
    ).toBe("\\pi");
  });

  it("returns empty when latexContent is missing or not a string", () => {
    expect(getLatexText({})).toBe("");
    expect(getLatexText({ latexContent: true })).toBe("");
  });

  it("returns empty for unsupported shapes", () => {
    expect(getLatexText({ paragraph: "x" })).toBe("");
  });
});
