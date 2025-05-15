import React from "react";
import { Byte } from "@/common/Byte";
import FirebaseService from "@/common/FirebaseService";
import { getDateString } from "@/common/timeUtils";
import Section from "./Section";
import { theme } from "@/common/theme";
import { METADATA_DESCRIPTION_CREDITS, WEBSITE_NAME } from "@/common/constants";
import { Metadata } from "next";

type RouteParams = {
  slug: string;
};

type BytePageProps = {
  params: Promise<RouteParams>;
};

/**
 * Retrieves all byte slugs from the backend and returns them as route parameters for static generation.
 *
 * @returns An array of route parameter objects, each containing a byte slug.
 */
export async function generateStaticParams(): Promise<RouteParams[]> {
  return await FirebaseService.getInstance().then(
    (firebaseService: FirebaseService): RouteParams[] =>
      firebaseService
        .getByteSlugs()
        .map((slug: string): RouteParams => ({ slug })),
  );
}

/**
 * Generates metadata for a Byte page based on the provided slug.
 *
 * Retrieves the byte's title from the backend and constructs a metadata object with a formatted title and description.
 *
 * @returns A metadata object containing the page title and description.
 */
export async function generateMetadata({
  params,
}: BytePageProps): Promise<Metadata> {
  const { slug }: RouteParams = await params;

  const title: string = await FirebaseService.getInstance().then(
    (firebaseService: FirebaseService): string => {
      const byte: Byte | undefined = firebaseService.getByte(slug);

      return byte ? byte.title : "Untitled byte";
    },
  );

  return {
    title: `${title} - ${WEBSITE_NAME}`,
    description: `The coding blog: ${title}. ${METADATA_DESCRIPTION_CREDITS}`,
  };
}

/**
 * Renders a page displaying a single "Byte" article, including its title, subtitle, series, publication dates, cover photo, and content sections.
 *
 * If the specified byte is not found, displays a "Byte not found" message.
 *
 * @param params - A promise resolving to an object containing the byte's slug.
 * @returns The rendered byte page as a React element.
 */
export default async function BytePage({ params }: BytePageProps) {
  const { slug }: RouteParams = await params;

  const byte: Byte | undefined = await FirebaseService.getInstance().then(
    (firebaseService: FirebaseService): Byte | undefined =>
      firebaseService.getByte(slug),
  );

  if (!byte) return <p>Byte not found</p>;

  const publishDateString: string = getDateString(byte.publishDate);
  const lastModifiedDateString: string = getDateString(byte.lastModifiedDate);

  const headingSpacing = "mb-1";

  return (
    <div
      className={`grid grid-cols-1 justify-self-center pt-5 ${theme.layout.page.width} ${theme.layout.page.bottomMargin}`}
    >
      <p
        className={`text-5xl font-bold ${headingSpacing} ${theme.colours.secondary.text}`}
      >
        {byte.title}
      </p>
      <p
        className={`text-2xl ${headingSpacing} ${theme.colours.tertiary.text}`}
      >
        {byte.subtitle}
      </p>
      <p
        style={{ backgroundColor: byte.series.accentColour }} // cannot be set in tailwind as this is dynamically generated
        className={`text-md inline-flex px-1 py-1 font-medium ring-1 ring-inset ring-slate-500 ${headingSpacing}`}
      >
        {byte.series.title}
      </p>
      <p className={`mb-1 text-md`}>
        <span className={theme.colours.tertiary.text}>Published: </span>
        {publishDateString}
      </p>
      {publishDateString !== lastModifiedDateString && (
        <p className={`text-md`}>
          <span className={theme.colours.tertiary.text}>Last modified: </span>
          {lastModifiedDateString}
        </p>
      )}
      <img
        src={byte.coverPhoto}
        alt={byte.title}
        className={`justify-self-center w-fit mt-2 sm:mt-6`}
      />
      {byte.sections.map((sectionProps, index) => (
        <Section key={index} {...sectionProps} />
      ))}
    </div>
  );
}
