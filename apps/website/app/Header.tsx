import React from "react";
import { CodeBracketIcon, HomeIcon } from "@heroicons/react/24/outline";
import CookieIcon from "./assets/CookieIcon";
import Link from "next/link";
import Logo from "./assets/Logo";
import {
  HOVER_BACKGROUND_COLOUR,
  PRIMARY_COLOUR_BG,
  SECONDARY_COLOUR_FILL,
  SECONDARY_COLOUR_TEXT,
} from "./common/theme";
import GithubLogo from "./assets/GithubLogo";
import LinkedInLogo from "./assets/LinkedInLogo";
import { GITHUB_URL, LINKEDIN_URL } from "./common/constants";

export enum Tab {
  Home,
  Bytes,
  Nibbles,
}

type HeaderProps = {
  tab: Tab;
  children: React.ReactNode;
};

const Header: React.FC<HeaderProps> = ({ tab, children }) => {
  const headerOptionStyle = `no-underline sm:py-2 md:py-3 ${HOVER_BACKGROUND_COLOUR}`;
  const headerOptionIconStyle = `inline h-auto w-5 sm:w-8 ${SECONDARY_COLOUR_TEXT}`;

  const tabStyle = "inline align-middle pl-2 text-base sm:text-xl"
  const defaultTabStyle = `text-white ${tabStyle}`;
  const selectedTabStyle = `${SECONDARY_COLOUR_TEXT} ${tabStyle}`;

  return (
      <div className={`grid inter.className pb-6 ${PRIMARY_COLOUR_BG}`}>
        <div className="grid grid-cols-3 py-2 sm:py-4 md:py-7">
          <Logo
            className={`justify-self-center col-span-1 h-auto w-20 sm:w-40 ${SECONDARY_COLOUR_TEXT}`}
          />
          <div className="col-span-2">
            <h1 className="text-2xl sm:text-5xl md:text-7xl font-bold">
              Bytes and nibbles
            </h1>
            <div className="flex flex-row items-center">
              <p
                className={`text-s sm:text-lg font-bold ${SECONDARY_COLOUR_TEXT}`}
              >
                By Samuel Matsuo Harris
              </p>
              <Link href={LINKEDIN_URL}>
                <LinkedInLogo
                  svgClassName={`size-8 ${SECONDARY_COLOUR_FILL}`}
                />
              </Link>
              <Link href={GITHUB_URL}>
                <GithubLogo
                  svgClassName="size-6"
                  pathClassName={SECONDARY_COLOUR_FILL}
                ></GithubLogo>
              </Link>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 text-center mb-2 sm:mb-0">
          <a href="/" className={headerOptionStyle}>
            <HomeIcon className={headerOptionIconStyle} />
            <p
              className={tab === Tab.Home ? selectedTabStyle : defaultTabStyle}
            >
              Home
            </p>
          </a>
          <a href="/bytes" className={headerOptionStyle}>
            <CodeBracketIcon className={headerOptionIconStyle} />
            <p
              className={tab === Tab.Bytes ? selectedTabStyle : defaultTabStyle}
            >
              Bytes
            </p>
          </a>
          <a href="/nibbles" className={headerOptionStyle}>
            <CookieIcon className={headerOptionIconStyle} />
            <p
              className={
                tab === Tab.Nibbles ? selectedTabStyle : defaultTabStyle
              }
            >
              Nibbles
            </p>
          </a>
        </div>
        {children}
      </div>
  );
};
export default Header;
