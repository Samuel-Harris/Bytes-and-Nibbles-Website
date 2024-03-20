import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ByteTilecardSubheading, ByteTilecardSubheadingProps } from "./ByteTilecardSubheading";

describe("Tilecard", () => {
  it("should render all given data", () => {
    const props: ByteTilecardSubheadingProps = {
        subtitle: "My subtitle",
        series: {title: "My series", accentColour: "#194D33"},
    };

    render(<ByteTilecardSubheading {...props} />);

    expect(screen.getByText(props.subtitle)).toBeInTheDocument();
    expect(screen.getByText(props.series.title)).toHaveStyle({"background-color": "#194D33"});
  });
});
