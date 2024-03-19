"use client";

import React, { SetStateAction, useState } from "react";
import FirebaseService from "../common/firebaseService";
import { Dispatch, useEffect } from "react";
import Tilecard from "../components/tilecard";
import { ByteOverview } from "../common/Byte";

export default function BytesPage(): React.JSX.Element {
  const [byteOverviews, setByteOverviews]: [
    ByteOverview[],
    Dispatch<SetStateAction<ByteOverview[]>>
  ] = useState<ByteOverview[]>([]);

  useEffect(() => {
    FirebaseService.getInstance().then(
      (firebaseService: FirebaseService): void =>
        setByteOverviews(firebaseService.listBytes())
    );
  }, [setByteOverviews]);

  return (
    <main className="grid grid-rows-auto justify-items-center ">
      {React.Children.toArray(
        byteOverviews.map((byteOverview: ByteOverview) => (
          <Tilecard
            title={byteOverview.title}
            subtitle={byteOverview.subtitle}
            series={byteOverview.series}
            timeTakenMinutes={undefined}
            thumbnail={byteOverview.thumbnail}
            publishDate={byteOverview.publishDate}
            linkPath={`/bytes/${byteOverview.slug}`}
          />
        ))
      )}
    </main>
  );
}
