import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Paragraph, { ParagraphProps } from "./Paragraph";
import { CaptionedImageType, ParagraphType } from "@/common/Byte";
import CaptionedImage, { CaptionedImageProps } from "./CaptionedImage";
import { mocked, MockedFunction } from "jest-mock";
import Subsection from "./Subsection";

jest.mock("./Paragraph");
jest.mock("./CaptionedImage");

describe("Byte section", () => {
  it("should render the subsection title and body", () => {
    const paragraphMockText = "This is a mock paragraph";
    const paragraphMock = mocked(Paragraph);
    paragraphMock.mockReturnValue(<p>{paragraphMockText}</p>);

    const captionedImageMockCaption = "This is a mock image caption";
    const captionedImageMock = mocked(CaptionedImage);
    captionedImageMock.mockReturnValue(<p>{captionedImageMockCaption}</p>);

    const sectionTitle = "Byte";
    const paragraph: ParagraphType = {
      type: "paragraph",
      value: "This is a paragraph",
    };
    const captionedImage: CaptionedImageType = {
      type: "captionedImage",
      value: { image: "This is an image", caption: "This is a caption" },
    };

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
