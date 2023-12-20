"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { CodeBracketIcon, HomeIcon } from "@heroicons/react/24/outline";
import CookieIcon from "./cookieIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { unstable_noStore } from "next/cache";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headerOptionStyle = "grid grid-rows-auto row-span-full";
  const headerOptionIconStyle = "row-span-full h-6 w-6 text-green-500";
  const getHeaderOptionTextStyle = (href: string) => {
    unstable_noStore();
    return clsx("row-span-full px-2",
    {
      "text-green-500": usePathname() === href,
    });
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="grid grid-rows-auto justify-items-center py-8">
          <Link href="/" className={headerOptionStyle}>
            <HomeIcon className={headerOptionIconStyle}/>
            <p className={getHeaderOptionTextStyle("/")}>Home</p>
          </Link>
          <Link href="/bytes" className={headerOptionStyle}>
            <CodeBracketIcon className={headerOptionIconStyle}/>
            <p className={getHeaderOptionTextStyle("/bytes")}>Bytes</p>
          </Link>
          <Link href="/nibbles" className={headerOptionStyle}>
            <div className={headerOptionIconStyle}>
              <CookieIcon/>
            </div>
            <p className={getHeaderOptionTextStyle("/nibbles")}>Nibbles</p>
          </Link>
        </div>
        {children}
      </body>
    </html>
  )
}
