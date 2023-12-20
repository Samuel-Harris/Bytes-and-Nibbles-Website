import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CodeBracketIcon, HomeIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import CookieIcon from "./cookieIcon";

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
          <div className="grid grid-rows-auto row-span-full">
            <HomeIcon className="row-span-full h-6 w-6 text-green-500">Home</HomeIcon>
            <p className="row-span-full px-2">Home</p>
          </div>
          <div className="grid grid-rows-auto row-span-full">
            <CodeBracketIcon className="row-span-full h-6 w-6 text-green-500"/>
            <p className="row-span-full px-2">Bytes</p>
          </div>
          <div className="grid grid-rows-auto row-span-full">
            <div className="row-span-full h-6 w-6 stroke-green-500">
              <CookieIcon/>
            </div>
            <p className="row-span-full px-2">Nibbles</p>
          </div>
        </div>
        {children}
      </body>
    </html>
  )
}
