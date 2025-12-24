import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Paragraph, { ParagraphProps } from "./Paragraph";
import { CaptionedImageType, ParagraphType } from "@bytes-and-nibbles/shared";
import CaptionedImage, { CaptionedImageProps } from "./CaptionedImage";
import { mocked, MockedFunction } from "jest-mock";
import Subsection from "./Subsection";

jest.mock("./Paragraph");
jest.mock("./CaptionedImage");

let paragraphMock: MockedFunction<React.FC<ParagraphProps>>;
let paragraphMockText: string;

let captionedImageMock: MockedFunction<React.FC<CaptionedImageProps>>;
let captionedImageMockCaption: string;

let sectionTitle: string;
let paragraph: ParagraphType;
let captionedImage: CaptionedImageType;

describe("Byte section", () => {
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

  it("should render the subsection title and body", () => {
    render(
      <Subsection title={sectionTitle} body={[paragraph, captionedImage]} />
    );

    expect(screen.getByText(sectionTitle)).toBeInTheDocument();

    // check whether paragraph was rendered
    expect(Paragraph).toHaveBeenCalledTimes(1);
    expect(screen.getByText(paragraphMockText)).toBeInTheDocument();

    // check whether captioned image was rendered
    expect(CaptionedImage).toHaveBeenCalledTimes(1);
    expect(screen.getByText(captionedImageMockCaption)).toBeInTheDocument();
  });
});
