import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Logo, { LogoProps } from "./Logo";

describe("Logo", () => {
  it("should be styled correctly", () => {
    const logoTitle =
      "A cookie with a bite take out of it surrounded by angle brackets.";
    const props: LogoProps = {
      className: "text-green-500",
    };

    render(<Logo {...props} />);

    expect(screen.getByTitle(logoTitle)).toBeInTheDocument();
    expect(screen.getByTitle(logoTitle)).toHaveStyle("color: rgb(34 197 94);");
  });
});
