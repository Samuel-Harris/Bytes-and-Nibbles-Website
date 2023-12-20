import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CodeBracketIcon, HomeIcon } from "@heroicons/react/24/outline";
import CookieIcon from "./cookieIcon";
import Link from "next/link";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bytes and Nibbles',
  description: 'The blog about two of my favourite hobbies: coding and cooking.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="grid grid-rows-auto justify-items-center py-8">
          <Link href="/" className="grid grid-rows-auto row-span-full">
            <HomeIcon className="row-span-full h-6 w-6 text-green-500"/>
            <p className="row-span-full px-2">Home</p>
          </Link>
          <Link href="/bytes" className="grid grid-rows-auto row-span-full">
            <CodeBracketIcon className="row-span-full h-6 w-6 text-green-500"/>
            <p className="row-span-full px-2">Bytes</p>
          </Link>
          <Link href="/nibbles" className="grid grid-rows-auto row-span-full">
            <div className="row-span-full h-6 w-6 stroke-green-500">
              <CookieIcon/>
            </div>
            <p className="row-span-full px-2">Nibbles</p>
          </Link>
        </div>
        {children}
      </body>
    </html>
  )
}
