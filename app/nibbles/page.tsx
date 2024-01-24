import { Metadata } from "next"
import { WEBSITE_NAME } from "../utils/websiteConstants"


export const metadata: Metadata = {
  title: `${WEBSITE_NAME} - nibbles`,
  description: "The recipes of the Bytes and Nibbles blog.",
}

export default function NibblesPage(): JSX.Element {
  return (
    <main>
      <div>
        <p>Nibbles page</p>
      </div>
    </main>
  )
}
