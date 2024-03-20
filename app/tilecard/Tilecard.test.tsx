import React from "react";
import Tilecard, { TilecardProps } from "./Tilecard";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { getDateString } from "../common/timeUtils";

describe("Tilecard", () => {
  it("should render all given data", () => {
    const props: TilecardProps = {
      title: "My title",
      children: <p>My subheading</p>,
      thumbnail: "My thumbnail",
      publishDate: new Date(2024, 1, 3),
      linkPath: "/path/to/blog",
    };

    render(<Tilecard {...props} />);

    expect(screen.getByText(props.title)).toBeInTheDocument();
    expect(screen.getByText("My subheading")).toBeInTheDocument();
    expect(
      screen.getByText(getDateString(props.publishDate))
    ).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", props.thumbnail);
    expect(screen.getByRole("link")).toHaveAttribute("href", props.linkPath);
  });
});
