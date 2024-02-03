import { render, screen } from "@testing-library/react";
import cookieIcon, { CookieIconProps } from "./cookieIcon";
import "@testing-library/jest-dom";

describe("Cookie component", function () {
  test("is styled correctly", function () {
    const cookieIconTitle =
      "A cookie with a bite take out of it surrounded by angle brackets.";
    const props: CookieIconProps = {
      className: "text-green-500",
    };

    render(cookieIcon(props));

    expect(screen.getByTitle(cookieIconTitle)).toBeInTheDocument();
    expect(screen.getByTitle(cookieIconTitle)).toHaveStyle(
      "color: rgb(34 197 94);"
    );
  });
});
