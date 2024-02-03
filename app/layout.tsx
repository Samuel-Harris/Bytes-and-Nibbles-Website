"use client";

import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { CodeBracketIcon, HomeIcon } from "@heroicons/react/24/outline";
import CookieIcon from "./assets/cookieIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import LogoIcon from "./assets/logoIcon";
import { style } from "./utils/websiteConstants";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerOptionStyle = `sm:py-2 md:py-3 ${style.hoverColour}`;
  const headerOptionIconStyle = `inline h-auto w-5 sm:w-8 ${style.accentColour}`;
  const useHeaderButtonTextStyle = (href: string): string => {
    return clsx("inline align-middle pl-2 text-base sm:text-xl", {
      [style.accentColour]: usePathname() === href,
    });
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="grid grid-cols-3 py-2 sm:py-4 md:py-7">
          <LogoIcon
            className={`justify-self-center col-span-1 h-auto w-20 sm:w-40 ${style.accentColour}`}
          />
          <div className="col-span-2">
            <h1 className="text-2xl sm:text-5xl md:text-7xl font-bold">
              Bytes and nibbles
            </h1>
            <p className={`text-s sm:text-lg font-bold ${style.accentColour}`}>
              By Samuel Matsuo Harris
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 text-center">
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
