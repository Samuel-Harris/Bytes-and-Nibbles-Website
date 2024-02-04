import Tilecard, { TilecardProps } from "./tilecard";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Tilecard", () => {
  it("should render all given data", () => {
    const props: TilecardProps = {
      title: "My title",
      subtitle: "My subtitle",
      thumbnail: "My thumbnail",
      publishDate: new Date(2024, 1, 3),
    };

    render(Tilecard(props));

    expect(screen.getByText(props.title)).toBeInTheDocument();
    expect(screen.getByText(props.subtitle)).toBeInTheDocument();
    expect(screen.getByText("Sat, 03 Feb 2024")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", props.thumbnail);
  });
});
