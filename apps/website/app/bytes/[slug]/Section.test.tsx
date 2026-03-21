import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Paragraph, { ParagraphProps } from "./Paragraph";
import { SectionBodyElementSchema } from "@bytes-and-nibbles/shared";
import CaptionedImage, { CaptionedImageProps } from "./CaptionedImage";
import Section from "./Section";
import { mocked, MockedFunction } from "jest-mock";
import Subsection, { SubsectionProps } from "./Subsection";
import { CollapsibleProps } from "./Collapsible";

jest.mock("./Paragraph");
jest.mock("./CaptionedImage");
jest.mock("./Subsection");
jest.mock("./Collapsible", () => ({
  __esModule: true,
  default: ({ title, children, isCollapsible }: CollapsibleProps) => (
    <div data-testid="collapsible" data-is-collapsible={isCollapsible}>
      <span>{title}</span>
      {children}
    </div>
  ),
}));

let paragraphMock: MockedFunction<React.FC<ParagraphProps>>;
let paragraphMockText: string;

let captionedImageMock: MockedFunction<React.FC<CaptionedImageProps>>;
let captionedImageMockCaption: string;

let subsectionMock: MockedFunction<React.FC<SubsectionProps>>;
let subsectionMockText: string;

let sectionTitle: string;
let paragraph1: SectionBodyElementSchema;
let captionedImage1: SectionBodyElementSchema;
let subsection: SectionBodyElementSchema;

describe("Byte section", () => {
  beforeAll(() => {
    paragraphMockText = "This is a mock paragraph";
    paragraphMock = mocked(Paragraph);
    paragraphMock.mockReturnValue(<p>{paragraphMockText}</p>);

    captionedImageMockCaption = "This is a mock image caption";
    captionedImageMock = mocked(CaptionedImage);
    captionedImageMock.mockReturnValue(<p>{captionedImageMockCaption}</p>);

    subsectionMockText = "This is a mock subsection";
    subsectionMock = mocked(Subsection);
    subsectionMock.mockReturnValue(<p>{subsectionMockText}</p>);

    sectionTitle = "Byte";
    paragraph1 = {
      type: "paragraph",
      value: { paragraph: "This is a paragraph 1", isFinished: true },
    };

    captionedImage1 = {
      type: "captionedImage",
      value: {
        image: "This is a image 1",
        caption: "This is a caption 1",
        isFinished: true,
      },
    };

    subsection = {
      type: "subsection",
      value: {
        title: "Subsection",
        isFinished: true,
        body: [
          {
            type: "paragraph",
            value: { paragraph: "Some internal paragraph", isFinished: true },
          },
        ],
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the section title and body via Collapsible", () => {
    render(
      <Section
        title={sectionTitle}
        body={[paragraph1, captionedImage1, subsection]}
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

    // check whether subsection was rendered
    expect(Subsection).toHaveBeenCalledTimes(1);
    expect(screen.getByText(subsectionMockText)).toBeInTheDocument();
  });

  it("should pass isCollapsible to Collapsible", () => {
    render(
      <Section title={sectionTitle} body={[paragraph1]} isCollapsible={true} />,
    );

    const collapsible = screen.getByTestId("collapsible");
    expect(collapsible).toBeInTheDocument();
    expect(collapsible).toHaveAttribute("data-is-collapsible", "true");
    expect(screen.getByText(sectionTitle)).toBeInTheDocument();
  });
});
