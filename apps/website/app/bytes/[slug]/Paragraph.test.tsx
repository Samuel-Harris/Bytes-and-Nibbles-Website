import React from "react";
import { render, screen } from "@testing-library/react";
import Paragraph from "./Paragraph";

describe("Byte paragraph", () => {
  it("should render the given paragraph", () => {
    const value = "This is a paragraph";

    render(<Paragraph value={value} />);

    expect(screen.getByText(value)).toBeInTheDocument();
  });
});
