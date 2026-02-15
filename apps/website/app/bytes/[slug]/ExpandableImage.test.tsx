import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ExpandableImage from "./ExpandableImage";

describe("ExpandableImage", () => {
  const caption = "Test Caption";
  const content = <div data-testid="image-content">Image Content</div>;

  it("should render children and not show expanded view initially", () => {
    render(<ExpandableImage caption={caption}>{content}</ExpandableImage>);

    expect(screen.getByTestId("image-content")).toBeInTheDocument();
    expect(screen.queryByLabelText("Close")).not.toBeInTheDocument();
  });

  it("should expand when clicked", () => {
    render(<ExpandableImage caption={caption}>{content}</ExpandableImage>);

    const wrapper = screen.getByTestId("image-content").parentElement!;
    fireEvent.click(wrapper);

    expect(screen.getByLabelText("Close")).toBeInTheDocument();
    // In expanded view, both the original and the expanded version are rendered in this simple test environment
    // but the important thing is the modal is visible.
    expect(screen.getByText(caption)).toBeInTheDocument();
  });

  it("should close when close button is clicked", () => {
    render(<ExpandableImage caption={caption}>{content}</ExpandableImage>);

    const wrapper = screen.getByTestId("image-content").parentElement!;
    fireEvent.click(wrapper);

    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);

    expect(screen.queryByLabelText("Close")).not.toBeInTheDocument();
  });
});
