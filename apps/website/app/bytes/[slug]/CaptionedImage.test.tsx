import React, { act, use, Suspense } from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import CaptionedImage from "./CaptionedImage";

// Helper to render async component in tests
const ResolvedCaptionedImage = (props: any) => {
  return use(CaptionedImage(props));
};

describe("Captioned image", () => {
  it("should render the given image and caption (non-svg)", async () => {
    const imageSrc = "https://example.com/image.jpg";
    const caption = "Image caption";

    await act(async () => {
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <ResolvedCaptionedImage image={imageSrc} caption={caption} />
        </Suspense>,
      );
    });

    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", imageSrc);
    expect(img).toHaveAttribute("alt", caption);

    expect(screen.getByText(caption)).toBeInTheDocument();
  });

  it("should render inline SVG when image is an svg", async () => {
    const svgUrl = "https://example.com/test.svg";
    const svgContent = '<svg id="test-svg"><path d="M0 0h10v10H0z"/></svg>';
    const caption = "SVG caption";

    // Mock fetch
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(svgContent),
      }),
    );

    await act(async () => {
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <ResolvedCaptionedImage image={svgUrl} caption={caption} />
        </Suspense>,
      );
    });

    await waitFor(() => {
      expect(document.querySelector("#test-svg")).toBeInTheDocument();
    });
    expect(screen.getByText(caption)).toBeInTheDocument();
  });
});
