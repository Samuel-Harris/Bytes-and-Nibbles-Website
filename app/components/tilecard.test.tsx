import React from "react";
import Tilecard, { TilecardProps } from "./tilecard";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { getDateString } from "../utils/timeUtils";
import { mocked } from "jest-mock";
import SeriesPill from "./SeriesPill";

describe("Tilecard", () => {
  it("should render all given data", () => {
    const props: TilecardProps = {
      title: "My title",
      subtitle: "My subtitle",
      series: {
        title: "Series title",
        accentColour: "Series colour",
      },
      thumbnail: "My thumbnail",
      publishDate: new Date(2024, 1, 3),
      linkPath: "/path/to/blog",
    };
    const SeriesPillMock = mocked(SeriesPill);
    SeriesPillMock.mockReturnValue(<div>Series pill</div>);

    render(<Tilecard {...props} />);

    expect(screen.getByText(props.title)).toBeInTheDocument();
    expect(screen.getByText(props.subtitle)).toBeInTheDocument();
    expect(
      screen.getByText(getDateString(props.publishDate))
    ).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", props.thumbnail);
    expect(screen.getByRole("link")).toHaveAttribute("href", props.linkPath);

    expect(SeriesPillMock).toHaveBeenCalledWith(props.series);
    expect(screen.getByText("Series pill")).toBeInTheDocument();
  });
});
