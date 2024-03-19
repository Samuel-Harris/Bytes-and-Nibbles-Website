"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import FirebaseService from "@/common/firebaseService";
import Tilecard from "@/components/tilecard";
import { NibbleOverview } from "@/common/Nibble";

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
            subtitle={undefined}
            series={undefined}
            timeTakenMinutes={nibbleOverview.timeTakenMinutes}
            thumbnail={nibbleOverview.thumbnail}
            publishDate={nibbleOverview.publishDate}
            linkPath={`/nibbles/${nibbleOverview.slug}`}
          />
        ))
      )}
    </main>
  );
}
