"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import FirebaseService from "@/common/FirebaseService";
import { NibbleOverview } from "@/common/Nibble";
import Tilecard from "@/tilecard/Tilecard";
import { NibbleTilecardSubheading } from "./NibbleTilecardSubheading";

export default function NibblesPage(): React.JSX.Element {
  const [nibbleOverviews, setNibbleOverviews]: [
    NibbleOverview[],
    Dispatch<SetStateAction<NibbleOverview[]>>
  ] = useState<NibbleOverview[]>([]);

  useEffect(() => {
    FirebaseService.getInstance().then(
      (firebaseService: FirebaseService): void =>
        setNibbleOverviews(firebaseService.listNibbles())
    );
  }, [setNibbleOverviews]);

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
