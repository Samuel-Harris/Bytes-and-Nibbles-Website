"use client";

import "./globals.css";
import React from "react";
import { CodeBracketIcon, HomeIcon } from "@heroicons/react/24/outline";
import CookieIcon from "./assets/cookieIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Logo from "./assets/Logo";
import { HOVER_BACKGROUND_COLOUR, PRIMARY_COLOUR_BG, SECONDARY_COLOUR_TEXT } from "./common/theme";

export default function Header({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const headerOptionStyle = `sm:py-2 md:py-3 ${HOVER_BACKGROUND_COLOUR}`;
  const headerOptionIconStyle = `inline h-auto w-5 sm:w-8 ${SECONDARY_COLOUR_TEXT}`;
  const useHeaderButtonTextStyle = (pathSegment: string): string => {
    const currentPath: string = usePathname();
    return clsx("inline align-middle pl-2 text-base sm:text-xl", {
      [SECONDARY_COLOUR_TEXT]:
        currentPath === pathSegment || currentPath.includes(`${pathSegment}/`),
    });
  };

  return (
    <html lang="en">
      <body className={`grid inter.className pb-6 ${PRIMARY_COLOUR_BG}`}>
        <div className="grid grid-cols-3 py-2 sm:py-4 md:py-7">
          <Logo
            className={`justify-self-center col-span-1 h-auto w-20 sm:w-40 ${SECONDARY_COLOUR_TEXT}`}
          />
          <div className="col-span-2">
            <h1 className="text-2xl sm:text-5xl md:text-7xl font-bold">
              Bytes and nibbles
            </h1>
            <p
              className={`text-s sm:text-lg font-bold ${SECONDARY_COLOUR_TEXT}`}
            >
              By Samuel Matsuo Harris
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 text-center mb-2 sm:mb-0">
          <Link href="/" className={headerOptionStyle}>
            <HomeIcon className={headerOptionIconStyle} />
            <p className={useHeaderButtonTextStyle("/")}>Home</p>
          </Link>
          <Link href="/bytes" className={headerOptionStyle}>
            <CodeBracketIcon className={headerOptionIconStyle} />
            <p className={useHeaderButtonTextStyle("/bytes")}>Bytes</p>
          </Link>
          <Link href="/nibbles" className={headerOptionStyle}>
            <CookieIcon className={headerOptionIconStyle} />
            <p className={useHeaderButtonTextStyle("/nibbles")}>Nibbles</p>
          </Link>
        </div>
        {children}
      </body>
    </html>
  );
}
