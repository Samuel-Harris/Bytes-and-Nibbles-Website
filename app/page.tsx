import { Metadata } from "next";
import { config } from "./utils/websiteConstants";

export const metadata: Metadata = {
  title: config.websiteName,
  description:
    "The blog about two of my favourite hobbies: coding and cooking.",
};

export default function Home(): JSX.Element {
  return (
    <main>
      <div>
        <p>Home page</p>
      </div>
    </main>
  );
}
