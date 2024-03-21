import React from "react";
import { Metadata } from "next";
import { WEBSITE_NAME } from "./common/constants";

export const metadata: Metadata = {
  title: WEBSITE_NAME,
  description:
    "The blog about two of my favourite hobbies: coding and cooking.",
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
