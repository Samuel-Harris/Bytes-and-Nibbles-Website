import React, { FC } from "react";
import "@testing-library/jest-dom";
import Header from "./Header";
import Logo, { LogoProps } from "./assets/Logo";
import { mocked, MockedFunction } from "jest-mock";
import { screen } from "@testing-library/dom";
import { usePathname } from "next/navigation";
import { render } from "@testing-library/react";

jest.mock("./assets/Logo");
jest.mock("./assets/cookieIcon");
jest.mock("./globals.css");
jest.mock("@heroicons/react/24/outline");
jest.mock("next/navigation");

describe("Header", () => {
  beforeAll(() => {
    // disable warning about rendering html within a div
    const consoleError = console.error;
    const SUPPRESSED_WARNINGS = ["cannot appear as a child of"];

    console.error = function filterWarnings(msg, ...args) {
      if (!SUPPRESSED_WARNINGS.some((entry) => msg.includes(entry))) {
        consoleError(msg, ...args);
      }
    };
  });

  it("should render the header", () => {
    const pathname: string = "/";
    const usePathnameMock: MockedFunction<() => string> = mocked(usePathname);
    usePathnameMock.mockReturnValue(pathname);

    const logoText: string = "This is a logo";
    const logo: JSX.Element = <p>{logoText}</p>;
    const logoMock: MockedFunction<FC<LogoProps>> = mocked(Logo);
    logoMock.mockReturnValue(logo);

    render(
      <Header>
        <></>
      </Header>
    );

    // check that logo is rendered
    expect(screen.getByText(logoText)).toBeInTheDocument();

    // check that expected text is present
    expect(screen.getByText("Bytes and nibbles")).toBeInTheDocument();
    expect(screen.getByText("By Samuel Matsuo Harris")).toBeInTheDocument();

    // check that expected links are present
    const expectedLinks: [string, string][] = [
      ["Home", "/"],
      ["Bytes", "/bytes"],
      ["Nibbles", "/nibbles"],
    ];
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(expectedLinks.length);
    for (const link of links) {
      var oneOfExpectedLinks = false;
      for (var i = 0; i < expectedLinks.length; i++) {
        const expectedLink: [string, string] = expectedLinks[i];
        if (link.textContent?.includes(expectedLink[0])) {
          expect(link).toHaveAttribute("href", expectedLink[1]);
          oneOfExpectedLinks = true;
          expectedLinks.splice(i, 1); // link has been seen. Shouldn't see it again
        }
      }
      expect(oneOfExpectedLinks).toBe(true);
    }
  });
});
