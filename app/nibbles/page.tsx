"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Metadata } from "next";
import { ByteOverview } from "@/common/Byte";
import FirebaseService from "@/common/firebaseService";
import Tilecard from "@/components/tilecard";

export const metadata: Metadata = {
  title: "Nibbles",
  description: "The recipes of the Bytes and Nibbles blog.",
};

export default function NibblesPage(): React.JSX.Element {
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
            thumbnail={byteOverview.thumbnail}
            publishDate={byteOverview.publishDate}
            linkPath={`/bytes/${byteOverview.slug}`}
          />
        ))
      )}
    </main>
  );
}
