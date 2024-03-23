import React from "react";
import FirebaseService from "../common/FirebaseService";
import Tilecard from "../tilecard/Tilecard";
import { ByteOverview } from "../common/Byte";
import { ByteTilecardSubheading } from "@/bytes/ByteTilecardSubheading";
import { Metadata } from "next";
import { METADATA_DESCRIPTION_CREDITS, WEBSITE_NAME } from "@/common/constants";

export const metadata: Metadata = {
  title: `Bytes - ${WEBSITE_NAME}`,
  description: `The list of published coding blogs. ${METADATA_DESCRIPTION_CREDITS}`,
};

export default async function BytesPage(): Promise<React.JSX.Element> {
  const byteOverviews: ByteOverview[] = await FirebaseService.getInstance().then(
    (firebaseService: FirebaseService): ByteOverview[] =>
      firebaseService.listBytes()
  );

  return (
    <main className="grid grid-rows-auto justify-items-center ">
      {React.Children.toArray(
        byteOverviews.map((byteOverview: ByteOverview) => (
          <Tilecard
            title={byteOverview.title}
            thumbnail={byteOverview.thumbnail}
            publishDate={byteOverview.publishDate}
            linkPath={`/bytes/${byteOverview.slug}`}
          >
            <ByteTilecardSubheading
              subtitle={byteOverview.subtitle}
              series={byteOverview.series}
            />
          </Tilecard>
        ))
      )}
    </main>
  );
}
