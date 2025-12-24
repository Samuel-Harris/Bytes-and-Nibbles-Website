import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Paragraph from "./Paragraph";
import { ParagraphType } from "@/common/Byte";

describe("Byte paragraph", () => {
  it("should render the given paragraph", () => {
    const paragraph: ParagraphType = {
      type: "paragraph",
      value: "This is a paragraph",
    };

    render(<Paragraph value={paragraph.value} />);

    expect(screen.getByText(paragraph.value)).toBeInTheDocument();
  });
});
