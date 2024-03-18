import React from "react";
import { Byte } from "@/utils/Byte";
import FirebaseService from "@/utils/firebaseService";
import theme from "@/utils/theme";
import { getDateString } from "@/utils/timeUtils";
import Section from "./Section";

type BytePageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  return await FirebaseService.getInstance().then(
    (firebaseService: FirebaseService): { slug: string }[] =>
      firebaseService.getSlugs().map((slug) => ({ slug }))
  );
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
      className={`grid justify-self-center pt-5 ${theme.pageWidth} ${theme.pageBottomMargin}`}
    >
      <p
        className={`text-5xl font-bold ${headingSpacing} ${theme.secondaryColourText}`}
      >
        {byte.title}
      </p>
      <p className={`text-2xl ${headingSpacing} ${theme.tertiaryColourText}`}>
        {byte.subtitle}
      </p>
      <p
        style={{ backgroundColor: byte.series.accentColour }} // cannot be set in tailwind as this is dynamically generated
        className={`text-md inline-flex px-1 py-1 font-medium ring-1 ring-inset ring-slate-500 ${headingSpacing}`}
      >
        {byte.series.title}
      </p>
      <p className={`mb-1 ${theme.dateStyle} ${theme.tertiaryColourText}`}>
        Published: <span className="text-white">{publishDateString}</span>
      </p>
      {publishDateString !== lastModifiedDateString && (
        <p className={`${theme.dateStyle} ${theme.tertiaryColourText}`}>
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
