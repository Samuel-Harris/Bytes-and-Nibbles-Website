import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Paragraph, { ParagraphProps } from "./Paragraph";
import { CaptionedImageType, ParagraphType } from "@/utils/Byte";
import CaptionedImage, { CaptionedImageProps } from "./CaptionedImage";
import Section from "./Section";
import { mocked, MockedFunction } from "jest-mock";

jest.mock("./Paragraph");
jest.mock("./CaptionedImage");

let paragraphMock: MockedFunction<React.FC<ParagraphProps>>;
let paragraphMockText: string;

let captionedImageMock: MockedFunction<React.FC<CaptionedImageProps>>;
let captionedImageMockSrc: string;
let captionedImageMockCaption: string;

describe("Byte section", () => {
  beforeAll(() => {
    paragraphMockText = "This is a mock paragraph";
    paragraphMock = mocked(Paragraph);
    paragraphMock.mockReturnValue(<p>{paragraphMockText}</p>);

    captionedImageMockSrc = "This is a mock image src";
    captionedImageMockCaption = "This is a mock image caption";
    captionedImageMock = mocked(CaptionedImage);
    captionedImageMock.mockReturnValue(<p>{captionedImageMockCaption}</p>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the section title", () => {
    const sectionTitle = "Byte";
    const paragraph: ParagraphType = {
      type: "paragraph",
      value: "This is a paragraph",
    };
    const captionedImage: CaptionedImageType = {
      type: "captionedImage",
      value: { image: "This is an image", caption: "This is a caption" },
    };

    render(<Section title={sectionTitle} body={[paragraph, captionedImage]} />);

    expect(screen.getByText(sectionTitle)).toBeInTheDocument();
  });

  it("should render the section body", async () => {
    const sectionTitle = "Byte title";
    const paragraph: ParagraphType = {
      type: "paragraph",
      value: "This is a paragraph",
    };
    const captionedImage: CaptionedImageType = {
      type: "captionedImage",
      value: { image: "This is an image", caption: "This is a caption" },
    };

    render(<Section title={sectionTitle} body={[paragraph, captionedImage]} />);

    // check whether paragraph was rendered
    expect(Paragraph).toHaveBeenCalledTimes(1);
    expect(screen.getByText(paragraphMockText)).toBeInTheDocument();

    // check whether captioned image was rendered
    expect(CaptionedImage).toHaveBeenCalledTimes(1);
    expect(screen.getByText(captionedImageMockCaption)).toBeInTheDocument();
  });
});
