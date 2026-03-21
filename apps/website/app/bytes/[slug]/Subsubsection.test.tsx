import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Paragraph, { ParagraphProps } from "./Paragraph";
import { SubsubsectionBodyElementSchema } from "@bytes-and-nibbles/shared";
import CaptionedImage, { CaptionedImageProps } from "./CaptionedImage";
import { mocked, MockedFunction } from "jest-mock";
import Subsubsection from "./Subsubsection";
import { CollapsibleProps } from "./Collapsible";

jest.mock("./Paragraph");
jest.mock("./CaptionedImage");
jest.mock("./Collapsible", () => ({
  __esModule: true,
  default: ({ title, children }: CollapsibleProps) => (
    <div data-testid="collapsible">
      <span>{title}</span>
      {children}
    </div>
  ),
}));

let paragraphMock: MockedFunction<React.FC<ParagraphProps>>;
let paragraphMockText: string;

let captionedImageMock: MockedFunction<React.FC<CaptionedImageProps>>;
let captionedImageMockCaption: string;

let subsubsectionTitle: string;
let paragraph: SubsubsectionBodyElementSchema;
let captionedImage: SubsubsectionBodyElementSchema;

describe("Byte subsubsection", () => {
  beforeAll(() => {
    paragraphMockText = "This is a mock paragraph";
    paragraphMock = mocked(Paragraph);
    paragraphMock.mockReturnValue(<p>{paragraphMockText}</p>);

    captionedImageMockCaption = "This is a mock image caption";
    captionedImageMock = mocked(CaptionedImage);
    captionedImageMock.mockReturnValue(<p>{captionedImageMockCaption}</p>);

    subsubsectionTitle = "Subsubsection heading";
    paragraph = {
      type: "paragraph",
      value: "This is a paragraph",
    };
    captionedImage = {
      type: "captionedImage",
      value: { image: "This is an image", caption: "This is a caption" },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the subsubsection title and body via Collapsible", () => {
    render(
      <Subsubsection
        title={subsubsectionTitle}
        body={[paragraph, captionedImage]}
        isCollapsible={false}
      />,
    );

    expect(screen.getByText(subsubsectionTitle)).toBeInTheDocument();

    expect(Paragraph).toHaveBeenCalledTimes(1);
    expect(screen.getByText(paragraphMockText)).toBeInTheDocument();

    expect(CaptionedImage).toHaveBeenCalledTimes(1);
    expect(screen.getByText(captionedImageMockCaption)).toBeInTheDocument();
  });

  it("should pass isCollapsible to Collapsible", () => {
    render(
      <Subsubsection
        title={subsubsectionTitle}
        body={[paragraph]}
        isCollapsible={true}
      />,
    );

    expect(screen.getByTestId("collapsible")).toBeInTheDocument();
    expect(screen.getByText(subsubsectionTitle)).toBeInTheDocument();
  });
});
