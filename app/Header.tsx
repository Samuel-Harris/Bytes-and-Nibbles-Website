import React from "react";
import { CodeBracketIcon, HomeIcon } from "@heroicons/react/24/outline";
import CookieIcon from "./assets/CookieIcon";
import Link from "next/link";
import Logo from "./assets/Logo";
import { theme } from "./common/theme";
import GithubLogo from "./assets/GithubLogo";
import LinkedInLogo from "./assets/LinkedInLogo";
import { GITHUB_URL, LINKEDIN_URL } from "./common/constants";

const headerOptionStyle: string = `no-underline sm:py-2 md:py-3 ${theme.colours.hover.bg}`;
const headerOptionIconStyle: string = `inline h-auto w-5 sm:w-8 ${theme.colours.secondary.text}`;

const tabStyle: string = "inline align-middle pl-2 text-base sm:text-xl";
const defaultTabStyle: string = `text-white ${tabStyle}`;
const selectedTabStyle: string = `${theme.colours.secondary.text} ${tabStyle}`;

/**
 * Enum representing the tabs in the header navigation
 */
export enum Tab {
  Home,
  Bytes,
  Nibbles,
}

/**
 * Props for the Header component
 */
interface HeaderProps {
  /** The currently active tab */
  tab: Tab;
  /** Child components to render inside the header layout */
  children: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ tab, children }) => (
  <div className={`grid inter.className pb-6 ${theme.colours.primary.bg}`}>
    <div className="grid grid-cols-3 py-2 sm:py-4 md:py-7">
      <Logo
        className={`justify-self-center col-span-1 h-auto w-20 sm:w-40 ${theme.colours.secondary.text}`}
        aria-label="Bytes and Nibbles Logo"
      />
      <div className="col-span-2">
        <h1 className="text-2xl sm:text-5xl md:text-7xl font-bold">
          Bytes and nibbles
        </h1>
        <div className="flex flex-row items-center">
          <p
            className={`text-s sm:text-lg font-bold ${theme.colours.secondary.text}`}
          >
            By Samuel Matsuo Harris
          </p>
          <Link href={LINKEDIN_URL} aria-label="LinkedIn Profile">
            <LinkedInLogo
              svgClassName={`size-8 ${theme.colours.secondary.fill}`}
            />
          </Link>
          <Link href={GITHUB_URL} aria-label="GitHub Profile">
            <GithubLogo
              svgClassName="size-6"
              pathClassName={theme.colours.secondary.fill}
            />
          </Link>
        </div>
      </div>
    </div>
    <nav
      className="grid grid-cols-3 text-center mb-2 sm:mb-0"
      aria-label="Main Navigation"
    >
      <a
        href="/"
        className={headerOptionStyle}
        aria-current={tab === Tab.Home ? "page" : undefined}
      >
        <HomeIcon className={headerOptionIconStyle} aria-hidden="true" />
        <p className={tab === Tab.Home ? selectedTabStyle : defaultTabStyle}>
          Home
        </p>
      </a>
      <a
        href="/bytes"
        className={headerOptionStyle}
        aria-current={tab === Tab.Bytes ? "page" : undefined}
      >
        <CodeBracketIcon className={headerOptionIconStyle} aria-hidden="true" />
        <p className={tab === Tab.Bytes ? selectedTabStyle : defaultTabStyle}>
          Bytes
        </p>
      </a>
      <a
        href="/nibbles"
        className={headerOptionStyle}
        aria-current={tab === Tab.Nibbles ? "page" : undefined}
      >
        <CookieIcon className={headerOptionIconStyle} aria-hidden="true" />
        <p className={tab === Tab.Nibbles ? selectedTabStyle : defaultTabStyle}>
          Nibbles
        </p>
      </a>
    </nav>
    {children}
  </div>
);
export default Header;
