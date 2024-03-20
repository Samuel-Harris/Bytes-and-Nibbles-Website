"use client";

import React, { SetStateAction, useState } from "react";
import FirebaseService from "../common/firebaseService_";
import { Dispatch, useEffect } from "react";
import Tilecard from "../tilecard/Tilecard";
import { ByteOverview } from "../common/Byte";
import { ByteTilecardSubheading } from "@/bytes/ByteTilecardSubheading";

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
