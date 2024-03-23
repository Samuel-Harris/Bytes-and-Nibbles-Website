import React from "react";
import { Metadata } from "next";
import { METADATA_DESCRIPTION_CREDITS, WEBSITE_NAME } from "./common/constants";

export const metadata: Metadata = {
  title: WEBSITE_NAME,
  description:
    `A blog about two of my favourite hobbies: coding and cooking. ${METADATA_DESCRIPTION_CREDITS}`,
};

export default function Home(): React.JSX.Element {
  return (
    <main>
      <div>
        <p>Home page</p>
      </div>
    </main>
  );
}
