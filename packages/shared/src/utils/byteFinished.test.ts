import { describe, expect, it } from "vitest";
import {
  SECTION_BODY_ELEMENT_TYPES,
  SUBSECTION_BODY_ELEMENT_TYPES,
} from "../schemas/bytes";
import {
  formatUnfinishedBytePathsForPublishError,
  isNodeFinished,
  listUnfinishedByteUnitPaths,
  markAllByteUnitsFinished,
} from "./byteFinished";

describe("isNodeFinished", () => {
  it("is true only when is_finished is strictly true", () => {
    expect(isNodeFinished({ is_finished: true })).toBe(true);
    expect(isNodeFinished({ is_finished: false })).toBe(false);
    expect(isNodeFinished({})).toBe(false);
    expect(isNodeFinished(undefined)).toBe(false);
    expect(isNodeFinished(null)).toBe(false);
  });
});

describe("listUnfinishedByteUnitPaths", () => {
  it("returns empty when sections are missing or not an array", () => {
    expect(listUnfinishedByteUnitPaths({})).toEqual([]);
    expect(listUnfinishedByteUnitPaths({ sections: null })).toEqual([]);
    expect(listUnfinishedByteUnitPaths({ sections: "nope" })).toEqual([]);
  });

  it("lists unfinished section and legacy string paragraph in section body", () => {
    const paths = listUnfinishedByteUnitPaths({
      sections: [
        {
          title: "Intro",
          body: [
            {
              type: SECTION_BODY_ELEMENT_TYPES.PARAGRAPH,
              value: "plain string",
            },
          ],
        },
      ],
    });
    expect(paths).toEqual(["Intro", "Intro → Paragraph 1"]);
  });

  it("does not list paragraph when map is marked finished", () => {
    const paths = listUnfinishedByteUnitPaths({
      sections: [
        {
          title: "Intro",
          is_finished: true,
          body: [
            {
              type: SECTION_BODY_ELEMENT_TYPES.PARAGRAPH,
              value: { paragraph: "x", is_finished: true },
            },
          ],
        },
      ],
    });
    expect(paths).toEqual([]);
  });

  it("walks subsection and subsubsection", () => {
    const paths = listUnfinishedByteUnitPaths({
      sections: [
        {
          title: "Main",
          is_finished: true,
          body: [
            {
              type: SECTION_BODY_ELEMENT_TYPES.SUBSECTION,
              value: {
                title: "Nested",
                is_finished: true,
                body: [
                  {
                    type: SUBSECTION_BODY_ELEMENT_TYPES.SUBSUBSECTION,
                    value: {
                      title: "Deep",
                      is_finished: true,
                      body: [
                        {
                          type: SUBSECTION_BODY_ELEMENT_TYPES.LATEX_PARAGRAPH,
                          value: { latexContent: "a", is_finished: false },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    });
    expect(paths).toEqual(["Main → Nested → Deep → LaTeX block 1"]);
  });

  it("lists unfinished captioned image and collapsible inner block", () => {
    const paths = listUnfinishedByteUnitPaths({
      sections: [
        {
          title: "S",
          is_finished: true,
          body: [
            {
              type: SECTION_BODY_ELEMENT_TYPES.CAPTIONED_IMAGE,
              value: { image: "p", caption: "c" },
            },
            {
              type: SECTION_BODY_ELEMENT_TYPES.COLLAPSIBLE_GROUP,
              value: {
                is_finished: true,
                body: [
                  {
                    type: SUBSECTION_BODY_ELEMENT_TYPES.PARAGRAPH,
                    value: { paragraph: "inner", is_finished: false },
                  },
                ],
              },
            },
          ],
        },
      ],
    });
    expect(paths).toEqual([
      "S → Captioned image 1",
      "S → Collapsible group 2 → Paragraph 1",
    ]);
  });
});

describe("markAllByteUnitsFinished", () => {
  it("marks every unit finished so listUnfinishedByteUnitPaths is empty", () => {
    const doc = {
      sections: [
        {
          title: "Intro",
          is_finished: false,
          body: [
            {
              type: SECTION_BODY_ELEMENT_TYPES.PARAGRAPH,
              value: "plain string",
            },
            {
              type: SECTION_BODY_ELEMENT_TYPES.SUBSECTION,
              value: {
                title: "Nested",
                is_finished: false,
                body: [
                  {
                    type: SUBSECTION_BODY_ELEMENT_TYPES.SUBSUBSECTION,
                    value: {
                      title: "Deep",
                      is_finished: false,
                      body: [
                        {
                          type: SUBSECTION_BODY_ELEMENT_TYPES.LATEX_PARAGRAPH,
                          value: { latexContent: "a", is_finished: false },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              type: SECTION_BODY_ELEMENT_TYPES.CAPTIONED_IMAGE,
              value: { image: "p", caption: "c" },
            },
            {
              type: SECTION_BODY_ELEMENT_TYPES.COLLAPSIBLE_GROUP,
              value: {
                is_finished: false,
                body: [
                  {
                    type: SUBSECTION_BODY_ELEMENT_TYPES.PARAGRAPH,
                    value: { paragraph: "inner", is_finished: false },
                  },
                ],
              },
            },
          ],
        },
      ],
    };
    markAllByteUnitsFinished(doc);
    expect(listUnfinishedByteUnitPaths(doc)).toEqual([]);
    expect(
      (doc.sections[0] as { is_finished?: boolean }).is_finished,
    ).toBe(true);
  });

  it("no-ops when sections missing", () => {
    expect(() => markAllByteUnitsFinished({})).not.toThrow();
  });
});

describe("formatUnfinishedBytePathsForPublishError", () => {
  it("returns generic copy when path list is empty", () => {
    expect(formatUnfinishedBytePathsForPublishError([])).toBe(
      "Cannot publish: unfinished content units must be marked finished first.",
    );
  });

  it("lists paths and omits +more when within preview limit", () => {
    expect(
      formatUnfinishedBytePathsForPublishError(["A", "B"], 5),
    ).toContain("• A");
    expect(
      formatUnfinishedBytePathsForPublishError(["A", "B"], 5),
    ).toContain("• B");
    expect(
      formatUnfinishedBytePathsForPublishError(["A", "B"], 5),
    ).not.toContain("+");
  });

  it("truncates with +n more beyond maxPreview", () => {
    const msg = formatUnfinishedBytePathsForPublishError(
      ["p1", "p2", "p3", "p4", "p5", "p6"],
      5,
    );
    expect(msg).toContain("• p1");
    expect(msg).toContain("• p5");
    expect(msg).not.toContain("• p6");
    expect(msg).toContain("+1 more");
  });
});
