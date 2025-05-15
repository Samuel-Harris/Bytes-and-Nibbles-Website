import React, { FC } from "react";
import "@testing-library/jest-dom";
import Header, { Tab } from "./Header";
import Logo, { LogoProps } from "./assets/Logo";
import { mocked, MockedFunction } from "jest-mock";
import { screen } from "@testing-library/dom";
import { usePathname } from "next/navigation";
import { render } from "@testing-library/react";
import { GITHUB_URL, LINKEDIN_URL } from "./common/constants";

jest.mock("./assets/Logo");
jest.mock("./assets/CookieIcon");
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

  it.each([Tab.Home, Tab.Bytes, Tab.Nibbles])(
    "should render the header",
    (tab: Tab) => {
      const pathname: string = "/";
      const usePathnameMock: MockedFunction<() => string> = mocked(usePathname);
      usePathnameMock.mockReturnValue(pathname);

      const logoText: string = "This is a logo";
      const logo: JSX.Element = <p>{logoText}</p>;
      const logoMock: MockedFunction<FC<LogoProps>> = mocked(Logo);
      logoMock.mockReturnValue(logo);

      render(
        <Header tab={tab}>
          <></>
        </Header>,
      );

      // check that logo is rendered
      expect(screen.getByText(logoText)).toBeInTheDocument();

      // check that expected text is present
      expect(screen.getByText("Bytes and nibbles")).toBeInTheDocument();
      expect(screen.getByText("By Samuel Matsuo Harris")).toBeInTheDocument();

      // check that expected links are present
      const expectedBannerLinks: [string, string][] = [
        ["Home", "/"],
        ["Bytes", "/bytes"],
        ["Nibbles", "/nibbles"],
      ];
      const expectedSocialLinks: string[] = [LINKEDIN_URL, GITHUB_URL];

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(
        expectedBannerLinks.length + expectedSocialLinks.length,
      );
      for (const link of expectedBannerLinks) {
        expect(screen.getByText(link[0]));
      }

      for (const link of links) {
        var oneOfExpectedLinks = false;
        for (var i = 0; i < expectedBannerLinks.length; i++) {
          const [text, url]: [string, string] = expectedBannerLinks[i];
          if (link.textContent?.includes(text)) {
            expect(link).toHaveAttribute("href", url);
            oneOfExpectedLinks = true;
            expectedBannerLinks.splice(i, 1);
          }
        }

        for (var i = 0; i < expectedSocialLinks.length; i++) {
          const url: string = expectedSocialLinks[i];
          if (link.attributes.getNamedItem("href")?.value === url) {
            oneOfExpectedLinks = true;
            expectedSocialLinks.splice(i, 1);
          }
        }

        expect(oneOfExpectedLinks).toBe(true);
      }
    },
  );
});
