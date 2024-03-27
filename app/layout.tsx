import React from "react";
import { Metadata } from "next";
import { METADATA_DESCRIPTION_CREDITS, WEBSITE_NAME } from "./common/constants";

export const metadata: Metadata = {
  title: WEBSITE_NAME,
  description: `A blog about two of my favourite hobbies: coding and cooking. ${METADATA_DESCRIPTION_CREDITS}`,
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};
export default RootLayout;
