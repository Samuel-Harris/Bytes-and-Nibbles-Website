import React from "react";
import { ByteSchema } from "@bytes-and-nibbles/shared";
import FirebaseService from "@/common/FirebaseService";
import { getDateString } from "@/common/timeUtils";
import Section from "./Section";

import { METADATA_DESCRIPTION_CREDITS, WEBSITE_NAME } from "@/common/constants";
import { Metadata } from "next";

type RouteParams = {
  slug: string;
};

type BytePageProps = {
  params: Promise<RouteParams>;
};

export async function generateStaticParams(): Promise<RouteParams[]> {
  return await FirebaseService.getInstance().then(
    (firebaseService: FirebaseService): RouteParams[] =>
      firebaseService
        .getByteSlugs()
        .map((slug: string): RouteParams => ({ slug })),
  );
}

export async function generateMetadata({
  params,
}: BytePageProps): Promise<Metadata> {
  const { slug }: RouteParams = await params;

  const title: string = await FirebaseService.getInstance().then(
    (firebaseService: FirebaseService): string => {
      const byte: ByteSchema | undefined = firebaseService.getByte(slug);

      return byte ? byte.title : "Untitled byte";
    },
  );

  return {
    title: `${title} - ${WEBSITE_NAME}`,
    description: `The coding blog: ${title}. ${METADATA_DESCRIPTION_CREDITS}`,
  };
}

export default async function BytePage({ params }: BytePageProps) {
  const { slug }: RouteParams = await params;

  const byte: ByteSchema | undefined = await FirebaseService.getInstance().then(
    (firebaseService: FirebaseService): ByteSchema | undefined =>
      firebaseService.getByte(slug),
  );

  if (!byte) return <p className="text-center text-xl p-10">Byte not found</p>;

  const publishDateString: string = getDateString(byte.publishDate);
  const lastModifiedDateString: string = getDateString(byte.lastModifiedDate);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 mb-10">
      <h1 className="text-5xl font-bold mb-2 text-primary">{byte.title}</h1>
      <h2 className="text-2xl mb-4 text-muted-foreground">{byte.subtitle}</h2>

      <div className="mb-6">
        <span
          style={{ backgroundColor: byte.series.accentColour }}
          className="inline-flex items-center rounded-md px-2 py-1 text-sm font-medium text-white ring-1 ring-inset ring-white/20"
        >
          {byte.series.title}
        </span>
      </div>

      <div className="flex flex-col gap-1 text-muted-foreground text-sm mb-6">
        <p>
          <span className="font-semibold">Published: </span>
          {publishDateString}
        </p>
        {publishDateString !== lastModifiedDateString && (
          <p>
            <span className="font-semibold">Last modified: </span>
            {lastModifiedDateString}
          </p>
        )}
      </div>

      <img
        src={byte.coverPhoto}
        alt={byte.title}
        className="w-full h-auto rounded-lg shadow-md mb-8 object-cover"
      />

      <div className="space-y-8">
        {byte.sections.map((sectionProps, index) => (
          <Section key={index} {...sectionProps} />
        ))}
      </div>
    </div>
  );
}
