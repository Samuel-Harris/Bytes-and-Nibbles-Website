import { Metadata } from "next"
import { WEBSITE_NAME } from "../constants/websiteConstants"


export const metadata: Metadata = {
  title: `${WEBSITE_NAME} - nibbles`,
  description: "The recipes of the Bytes and Nibbles blog.",
}

export default function NibblesPage() {
  return (
    <main>
      <div>
        <p>Nibbles page</p>
      </div>
    </main>
  )
}
