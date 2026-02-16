import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Paragraph, { ParagraphProps } from "./Paragraph";
import { SubsectionBodyElementSchema } from "@bytes-and-nibbles/shared";
import CaptionedImage, { CaptionedImageProps } from "./CaptionedImage";
import { mocked, MockedFunction } from "jest-mock";
import Subsection from "./Subsection";
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

let sectionTitle: string;
let paragraph: SubsectionBodyElementSchema;
let captionedImage: SubsectionBodyElementSchema;

describe("Byte subsection", () => {
  beforeAll(() => {
    paragraphMockText = "This is a mock paragraph";
    paragraphMock = mocked(Paragraph);
    paragraphMock.mockReturnValue(<p>{paragraphMockText}</p>);

    captionedImageMockCaption = "This is a mock image caption";
    captionedImageMock = mocked(CaptionedImage);
    captionedImageMock.mockReturnValue(<p>{captionedImageMockCaption}</p>);

    sectionTitle = "Byte";
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

  it("should render the subsection title and body via Collapsible", () => {
    render(
      <Subsection
        title={sectionTitle}
        body={[paragraph, captionedImage]}
        isCollapsible={false}
      />,
    );

    expect(screen.getByText(sectionTitle)).toBeInTheDocument();

    // check whether paragraph was rendered
    expect(Paragraph).toHaveBeenCalledTimes(1);
    expect(screen.getByText(paragraphMockText)).toBeInTheDocument();

    // check whether captioned image was rendered
    expect(CaptionedImage).toHaveBeenCalledTimes(1);
    expect(screen.getByText(captionedImageMockCaption)).toBeInTheDocument();
  });

  it("should pass isCollapsible to Collapsible", () => {
    render(
      <Subsection
        title={sectionTitle}
        body={[paragraph]}
        isCollapsible={true}
      />,
    );

    expect(screen.getByTestId("collapsible")).toBeInTheDocument();
    expect(screen.getByText(sectionTitle)).toBeInTheDocument();
  });
});
