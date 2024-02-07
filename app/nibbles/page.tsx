import React from "react";
import { Metadata } from "next";
import { config } from "../utils/websiteConstants";

export const metadata: Metadata = {
  title: `${config.websiteName} - nibbles`,
  description: "The recipes of the Bytes and Nibbles blog.",
};

export default function NibblesPage(): JSX.Element {
  return (
    <main>
      <div>
        <p>Nibbles page</p>
      </div>
    </main>
  );
}
