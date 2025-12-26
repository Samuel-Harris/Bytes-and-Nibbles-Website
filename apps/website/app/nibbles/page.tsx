import React from "react";
import FirebaseService from "@/common/FirebaseService";
import { NibbleOverviewType } from "@bytes-and-nibbles/shared";
import Tilecard from "@/tilecard/Tilecard";
import TilecardSubheading from "./TilecardSubheading";
import { Metadata } from "next";
import { METADATA_DESCRIPTION_CREDITS, WEBSITE_NAME } from "@/common/constants";

export const metadata: Metadata = {
  title: `Nibbles - ${WEBSITE_NAME}`,
  description: `The list of published recipes. ${METADATA_DESCRIPTION_CREDITS}`,
};

export default async function NibblesPage(): Promise<React.JSX.Element> {
  const nibbleOverviews: NibbleOverviewType[] =
    await FirebaseService.getInstance().then(
      (firebaseService: FirebaseService): NibbleOverviewType[] =>
        firebaseService.listNibbles()
    );

  return (
    <div className="grid grid-rows-auto justify-items-center ">
      {nibbleOverviews.map((nibbleOverview: NibbleOverviewType) => (
        <Tilecard
          key={nibbleOverview.slug}
          title={nibbleOverview.title}
          thumbnail={nibbleOverview.thumbnail}
          publishDate={nibbleOverview.publishDate}
          linkPath={`/nibbles/${nibbleOverview.slug}`}
        >
          <TilecardSubheading
            timeTakenMinutes={nibbleOverview.timeTakenMinutes}
          />
        </Tilecard>
      ))}
    </div>
  );
}
