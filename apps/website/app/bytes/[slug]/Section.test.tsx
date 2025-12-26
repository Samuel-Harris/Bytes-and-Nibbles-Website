import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Paragraph, { ParagraphProps } from "./Paragraph";
import { CaptionedImageType, ParagraphType, SubsectionType } from "@bytes-and-nibbles/shared";
import CaptionedImage, { CaptionedImageProps } from "./CaptionedImage";
import Section from "./Section";
import { mocked, MockedFunction } from "jest-mock";
import Subsection, { SubsectionProps } from "./Subsection";

jest.mock("./Paragraph");
jest.mock("./CaptionedImage");
jest.mock("./Subsection");

let paragraphMock: MockedFunction<React.FC<ParagraphProps>>;
let paragraphMockText: string;

let captionedImageMock: MockedFunction<React.FC<CaptionedImageProps>>;
let captionedImageMockCaption: string;

let subsectionMock: MockedFunction<React.FC<SubsectionProps>>;
let subsectionMockText: string;

let sectionTitle: string;
let paragraph1: ParagraphType;
let paragraph2: ParagraphType;
let captionedImage1: CaptionedImageType
let captionedImage2: CaptionedImageType
let subsection: SubsectionType

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
      value: "This is a paragraph 1",
    };
    paragraph2 = {
      type: "paragraph",
      value: "This is a paragraph 2",
    };

    captionedImage1 = {
      type: "captionedImage",
      value: { image: "This is a image 1", caption: "This is a caption 1" },
    };
    captionedImage2 = {
      type: "captionedImage",
      value: { image: "This is a image 2", caption: "This is a caption 2" },
    };

    subsection = {
      type: "subsection",
      value: {
        title: "Subsection",
        body: [paragraph2, captionedImage2],
      }
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the section title and body", () => {
    render(<Section title={sectionTitle} body={[paragraph1, captionedImage1, subsection]} />);

    expect(screen.getByText(sectionTitle)).toBeInTheDocument();

    // check whether paragraph was rendered
    expect(Paragraph).toHaveBeenCalledTimes(1);
    expect(screen.getByText(paragraphMockText)).toBeInTheDocument();

    // check whether captioned image was rendered
    expect(CaptionedImage).toHaveBeenCalledTimes(1);
    expect(screen.getByText(captionedImageMockCaption)).toBeInTheDocument();

    // check whether captioned image was rendered
    expect(Subsection).toHaveBeenCalledTimes(1);
    expect(screen.getByText(subsectionMockText)).toBeInTheDocument();
  });
});
