import React from "react";
import FirebaseService from "@/common/FirebaseService";
import { NibbleOverview } from "@/common/Nibble";
import Tilecard from "@/tilecard/Tilecard";
import { NibbleTilecardSubheading } from "./NibbleTilecardSubheading";

export default async function NibblesPage(): Promise<React.JSX.Element> {
  const nibbleOverviews: NibbleOverview[] =
    await FirebaseService.getInstance().then(
      (firebaseService: FirebaseService): NibbleOverview[] =>
        firebaseService.listNibbles()
    );

  return (
    <main className="grid grid-rows-auto justify-items-center ">
      {React.Children.toArray(
        nibbleOverviews.map((nibbleOverview: NibbleOverview) => (
          <Tilecard
            title={nibbleOverview.title}
            thumbnail={nibbleOverview.thumbnail}
            publishDate={nibbleOverview.publishDate}
            linkPath={`/nibbles/${nibbleOverview.slug}`}
          >
            <NibbleTilecardSubheading
              timeTakenMinutes={nibbleOverview.timeTakenMinutes}
            />
          </Tilecard>
        ))
      )}
    </main>
  );
}
