import React from "react";
import { render, screen } from "@testing-library/react";
import CookieIcon, { CookieIconProps } from "./cookieIcon";
import "@testing-library/jest-dom";

describe("Cookie", () => {
  it("should styled correctly", () => {
    const cookieIconTitle =
      "A cookie with a bite take out of it surrounded by angle brackets.";
    const props: CookieIconProps = {
      className: "text-green-500",
    };

    render(<CookieIcon {...props} />);

    expect(screen.getByTitle(cookieIconTitle)).toBeInTheDocument();
    expect(screen.getByTitle(cookieIconTitle)).toHaveStyle({
      color: "rgb(34 197 94);",
    });
  });
});
