import { Metadata } from "next"
import { WEBSITE_NAME } from "../constants/websiteConstants"


export const metadata: Metadata = {
  title: `${WEBSITE_NAME} - bytes`,
  description: "The tech blogs of the Bytes and Nibbles blog.",
}

export default function BytesPage() {
  return (
    <main>
      <div>
        <p>Bytes page</p>
      </div>
    </main>
  )
}
