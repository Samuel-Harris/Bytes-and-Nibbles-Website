import React from "react";
import { Byte } from "@/common/Byte";
import FirebaseService from "@/common/FirebaseService";
import { getDateString } from "@/common/timeUtils";
import Section from "./Section";
import {
  PAGE_BOTTOM_MARGIN,
  PAGE_WIDTH,
  SECONDARY_COLOUR_TEXT,
  TERTIARY_COLOUR_TEXT,
} from "@/common/theme";
import { WEBSITE_NAME } from "@/common/constants";
import { Metadata } from "next";

type RouteParams = {
  slug: string;
};

type BytePageProps = {
  params: RouteParams;
};

export async function generateStaticParams(): Promise<RouteParams[]> {
  return await FirebaseService.getInstance().then(
    (firebaseService: FirebaseService): RouteParams[] =>
      firebaseService.getSlugs().map((slug: string): RouteParams => ({ slug }))
  );
}

export async function generateMetadata({
  params: { slug },
}: BytePageProps): Promise<Metadata> {
  const title: string = await FirebaseService.getInstance().then(
    (firebaseService: FirebaseService): string => {
      const byte = firebaseService.getByte(slug);
      
      return byte ? byte.title : "Untitled byte";
    }
  );

  return {
    title: `${title} - ${WEBSITE_NAME}`,
  };
}

export default async function BytePage({ params: { slug } }: BytePageProps) {
  const byte: Byte | undefined = await FirebaseService.getInstance().then(
    (firebaseService) => firebaseService.getByte(slug)
  );

  if (!byte) return <main>Byte not found</main>;

  const publishDateString: string = getDateString(byte.publishDate);
  const lastModifiedDateString: string = getDateString(byte.lastModifiedDate);

  const headingSpacing = "mb-1";

  return (
    <main
      className={`grid justify-self-center pt-5 ${PAGE_WIDTH} ${PAGE_BOTTOM_MARGIN}`}
    >
      <p
        className={`text-5xl font-bold ${headingSpacing} ${SECONDARY_COLOUR_TEXT}`}
      >
        {byte.title}
      </p>
      <p className={`text-2xl ${headingSpacing} ${TERTIARY_COLOUR_TEXT}`}>
        {byte.subtitle}
      </p>
      <p
        style={{ backgroundColor: byte.series.accentColour }} // cannot be set in tailwind as this is dynamically generated
        className={`text-md inline-flex px-1 py-1 font-medium ring-1 ring-inset ring-slate-500 ${headingSpacing}`}
      >
        {byte.series.title}
      </p>
      <p className={`mb-1 text-md ${TERTIARY_COLOUR_TEXT}`}>
        Published: <span className="text-white">{publishDateString}</span>
      </p>
      {publishDateString !== lastModifiedDateString && (
        <p className={`text-md ${TERTIARY_COLOUR_TEXT}`}>
          Last modified:{" "}
          <span className="text-white">{lastModifiedDateString}</span>
        </p>
      )}
      <img
        src={byte.coverPhoto}
        alt={byte.title}
        className={`justify-self-center w-fit mt-2 sm:mt-6`}
      />
      {React.Children.toArray(byte.sections.map(Section))}
    </main>
  );
}
