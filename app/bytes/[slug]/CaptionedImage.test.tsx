import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import CaptionedImage from "./CaptionedImage";

describe("Byte paragraph", () => {
  it("should render the given image and caption", () => {
    const imageSrc = "https://example.com/image.jpg";
    const caption = "Image caption";

    render(<CaptionedImage image={imageSrc} caption={caption} />);

    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", imageSrc);
    expect(img).toHaveAttribute("alt", caption);

    expect(screen.getByText(caption)).toBeInTheDocument();
  });
});
