"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { CodeBracketIcon, HomeIcon } from "@heroicons/react/24/outline";
import CookieIcon from "./assets/cookieIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import LogoIcon from "./assets/logoIcon";
import { THEME_COLOUR } from "./constants/websiteConstants";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headerOptionStyle = "grid row-span-1 col-span-1";
  const headerOptionIconStyle = "row-span-full h-6 w-6 " + THEME_COLOUR;
  const useHeaderButtonTextStyle = (href: string): string => {
    return clsx("row-span-full px-2",
    {
      [THEME_COLOUR]: usePathname() === href,
    });
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="grid grid-rows-4 grid-cols-3 justify-items-center py-1">
          <div className="row-span-3 col-span-1">
            <LogoIcon/>
          </div>
          <h1 className="row-span-2 col-span-2 justify-self-start flex items-center text-7xl font-bold font-sans">Bytes and nibbles</h1>
          <p className={"row-span-1 col-span-2 justify-self-start flex items-center font-bold font-san " + THEME_COLOUR}>By Samuel Matsuo Harris</p>

          <Link href="/" className={headerOptionStyle}>
            <HomeIcon className={headerOptionIconStyle}/>
            <p className={useHeaderButtonTextStyle("/")}>Home</p>
          </Link>
          <Link href="/bytes" className={headerOptionStyle}>
            <CodeBracketIcon className={headerOptionIconStyle}/>
            <p className={useHeaderButtonTextStyle("/bytes")}>Bytes</p>
          </Link>
          <Link href="/nibbles" className={headerOptionStyle}>
            <div className={headerOptionIconStyle}>
              <CookieIcon/>
            </div>
            <p className={useHeaderButtonTextStyle("/nibbles")}>Nibbles</p>
          </Link>

        </div>
        {children}
      </body>
    </html>
  )
}
