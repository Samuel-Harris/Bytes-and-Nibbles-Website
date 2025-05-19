import React from "react";
import FirebaseService from "../common/FirebaseService";
import Tilecard from "../tilecard/Tilecard";
import { ByteOverview } from "../common/Byte";
import TilecardSubheading from "@/bytes/TilecardSubheading";
import { Metadata } from "next";
import { METADATA_DESCRIPTION_CREDITS, WEBSITE_NAME } from "@/common/constants";

export const metadata: Metadata = {
  title: `Bytes - ${WEBSITE_NAME}`,
  description: `The list of published coding blogs. ${METADATA_DESCRIPTION_CREDITS}`,
};

/**
 * Renders a page displaying a grid of coding blog entries ("bytes") with their metadata.
 *
 * Fetches an array of byte overviews from the backend and displays each as a tile card with title, thumbnail, publish date, subtitle, and series information.
 *
 * @returns A JSX element containing the grid of byte overview cards.
 */
export default async function BytesPage(): Promise<React.JSX.Element> {
  const byteOverviews: ByteOverview[] =
    await FirebaseService.getInstance().then(
      (firebaseService: FirebaseService): ByteOverview[] =>
        firebaseService.listBytes()
    );

  return (
    <div className="grid grid-rows-auto justify-items-center ">
      {byteOverviews.map((byteOverview: ByteOverview) => (
        <Tilecard
          title={byteOverview.title}
          thumbnail={byteOverview.thumbnail}
          publishDate={byteOverview.publishDate}
          linkPath={`/bytes/${byteOverview.slug}`}
          key={byteOverview.slug}
        >
          <TilecardSubheading
            subtitle={byteOverview.subtitle}
            series={byteOverview.series}
          />
        </Tilecard>
      ))}
    </div>
  );
}
