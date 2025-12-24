import "./globals.css";
import React from "react";
import { Metadata } from "next";
import { METADATA_DESCRIPTION_CREDITS, WEBSITE_NAME } from "./common/constants";
import { GoogleAnalytics } from "@next/third-parties/google";
import { firebaseConfig } from "./common/firebaseConstants";

export const metadata: Metadata = {
  title: WEBSITE_NAME,
  description: `A blog about two of my favourite hobbies: coding and cooking. ${METADATA_DESCRIPTION_CREDITS}`,
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => (
  <html lang="en">
    <body>{children}</body>
    {firebaseConfig.measurementId && (
      <GoogleAnalytics gaId={firebaseConfig.measurementId} />
    )}
  </html>
);
export default RootLayout;
