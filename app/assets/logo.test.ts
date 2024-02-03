import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import logo, { LogoProps } from "./logo";

describe("Logo component", function () {
  test("is styled correctly", function () {
    const logoTitle =
      "A cookie with a bite take out of it surrounded by angle brackets.";
    const props: LogoProps = {
      className: "text-green-500",
    };

    render(logo(props));

    expect(screen.getByTitle(logoTitle)).toBeInTheDocument();
    expect(screen.getByTitle(logoTitle)).toHaveStyle(
      "color: rgb(34 197 94);"
    );
  });
});
