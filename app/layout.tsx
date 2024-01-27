"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { CodeBracketIcon, HomeIcon } from "@heroicons/react/24/outline";
import CookieIcon from "./assets/cookieIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import LogoIcon from "./assets/logoIcon";
import { config, style } from "./utils/websiteConstants";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({children}: {children: React.ReactNode}) {
  const headerOptionStyle = `row-span-full w-full px-3 py-2 hover:${style.hoverColour}`;
  const headerOptionIconStyle = `inline h-6 w-6 ${style.accentColour}`;
  const useHeaderButtonTextStyle = (href: string): string => {
    return clsx("inline pl-2",
    {
      [style.accentColour]: usePathname() === href,
    });
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="grid grid-rows-3 grid-cols-3 pt-2">
          <div className="justify-self-center row-span-3 col-span-1">
            <LogoIcon className={`h-40 w-40 ${style.accentColour}`}/>
          </div>
          <h1 className="row-span-2 col-span-2 justify-self-start flex items-center text-7xl font-bold font-sans">Bytes and nibbles</h1>
          <p className={`row-span-1 col-span-2 justify-self-start flex items-center font-bold font-san ${style.accentColour}`}>By Samuel Matsuo Harris</p>
        </div>
        <div className="grid grid-cols-3 text-center">
          <Link href="/" className={headerOptionStyle}>
            <HomeIcon className={headerOptionIconStyle}/>
            <p className={useHeaderButtonTextStyle("/")}>Home</p>
          </Link>
          <Link href="/bytes" className={headerOptionStyle}>
            <CodeBracketIcon className={headerOptionIconStyle}/>
            <p className={useHeaderButtonTextStyle("/bytes")}>Bytes</p>
          </Link>
          <Link href="/nibbles" className={headerOptionStyle}>
            <CookieIcon className={headerOptionIconStyle}/>
            <p className={useHeaderButtonTextStyle("/nibbles")}>Nibbles</p>
          </Link>
          </div>
        {children}
      </body>
    </html>
  )
}
