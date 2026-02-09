"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CodeBracketIcon, HomeIcon } from "@heroicons/react/24/outline";
import CookieIcon from "./assets/CookieIcon";
import Logo from "./assets/Logo";
import GithubLogo from "./assets/GithubLogo";
import LinkedInLogo from "./assets/LinkedInLogo";
import { GITHUB_URL, LINKEDIN_URL } from "./common/constants";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export enum Tab {
  Home,
  Bytes,
  Nibbles,
}

type HeaderProps = {
  tab?: Tab; // Made optional as we can derive active state from path if needed, but keeping for compatibility
  children: React.ReactNode;
};

const Header: React.FC<HeaderProps> = ({ children }) => {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isBytes = pathname?.startsWith("/bytes");
  const isNibbles = pathname?.startsWith("/nibbles");

  return (
    <div className="bg-background pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 py-4 md:py-8 gap-4 items-center">
          <div className="flex justify-center md:justify-start">
            <Logo className="h-auto w-20 sm:w-32 md:w-40 text-primary" />
          </div>

          <div className="col-span-1 md:col-span-2 text-center md:text-left">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-2">
              Bytes and nibbles
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4">
              <p className="text-lg font-bold text-primary">
                By Samuel Matsuo Harris
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedInLogo svgClassName="size-6 fill-primary" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GithubLogo
                      svgClassName="size-6"
                      pathClassName="fill-primary"
                    />
                    <span className="sr-only">GitHub</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "h-auto text-lg px-6 py-3",
                      isHome && "bg-accent",
                    )}
                  >
                    <HomeIcon className="w-12 h-12 mr-3" />
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/bytes" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "h-auto text-lg px-6 py-3",
                      isBytes && "bg-accent",
                    )}
                  >
                    <CodeBracketIcon className="w-12 h-12 mr-3" />
                    Bytes
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/nibbles" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "h-auto text-lg px-6 py-3",
                      isNibbles && "bg-accent",
                    )}
                  >
                    <CookieIcon className="w-12 h-12 mr-3" />
                    Nibbles
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Header;
