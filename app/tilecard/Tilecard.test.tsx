import React from "react";
import Tilecard, { TilecardProps } from "./Tilecard";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { getDateString } from "../common/timeUtils";

describe("Tilecard", () => {
  const childComponentText: string = "My subheading";
  it("should render all given data", () => {
    const props: TilecardProps = {
      title: "My title",
      children: <p>{childComponentText}</p>,
      thumbnail: "My thumbnail",
      publishDate: new Date(2024, 1, 3),
      linkPath: "/path/to/blog",
    };

    render(<Tilecard {...props} />);

    const { title, thumbnail, publishDate, linkPath }: TilecardProps = props;
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(childComponentText)).toBeInTheDocument();
    expect(screen.getByText(getDateString(publishDate))).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", thumbnail);
    expect(screen.getByRole("link")).toHaveAttribute("href", linkPath);
  });
});
