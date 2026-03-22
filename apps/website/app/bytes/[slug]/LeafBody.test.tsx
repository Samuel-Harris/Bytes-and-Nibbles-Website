import React from "react";
import type { MockedFunction } from "vitest";
import { render, screen } from "@testing-library/react";
import Paragraph, { ParagraphProps } from "./Paragraph";
import { SubsubsectionBodyElementSchema } from "@bytes-and-nibbles/shared";
import LeafBody from "./LeafBody";
import LatexParagraph, { LatexParagraphProps } from "./LatexParagraph";

vi.mock("./Paragraph");
vi.mock("./LatexParagraph");

let paragraphMock: MockedFunction<React.FC<ParagraphProps>>;
let paragraphMockText: string;

let latexMock: MockedFunction<React.FC<LatexParagraphProps>>;
let latexMockText: string;

describe("LeafBody", () => {
  beforeAll(() => {
    paragraphMockText = "mock paragraph";
    paragraphMock = vi.mocked(Paragraph);
    paragraphMock.mockReturnValue(<p>{paragraphMockText}</p>);

    latexMockText = "mock latex";
    latexMock = vi.mocked(LatexParagraph);
    latexMock.mockReturnValue(<p>{latexMockText}</p>);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("passes paragraph text from map-shaped values to Paragraph", () => {
    const body: SubsubsectionBodyElementSchema[] = [
      {
        type: "paragraph",
        value: { paragraph: "Map paragraph", is_finished: false },
      },
    ];
    render(<LeafBody body={body} />);

    expect(paragraphMock.mock.calls[0][0]).toMatchObject({
      value: "Map paragraph",
    });
    expect(screen.getByText(paragraphMockText)).toBeInTheDocument();
  });

  it("passes LaTeX text from map-shaped values to LatexParagraph", () => {
    const body: SubsubsectionBodyElementSchema[] = [
      {
        type: "latexParagraph",
        value: { latexContent: "\\alpha", is_finished: true },
      },
    ];
    render(<LeafBody body={body} />);

    expect(latexMock.mock.calls[0][0]).toMatchObject({ value: "\\alpha" });
    expect(screen.getByText(latexMockText)).toBeInTheDocument();
  });
});
