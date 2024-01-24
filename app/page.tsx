import { Metadata } from "next"
import { WEBSITE_NAME } from "./utils/websiteConstants"

export const metadata: Metadata = {
  title: WEBSITE_NAME,
  description: "The blog about two of my favourite hobbies: coding and cooking.",
}

export default function Home(): JSX.Element {
  return (
    <main>
      <div>
        <p>Home page</p>
      </div>
    </main>
  )
}
