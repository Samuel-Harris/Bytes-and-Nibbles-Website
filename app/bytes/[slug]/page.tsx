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
    async (firebaseService: FirebaseService) =>
      firebaseService.getSlugs().map((slug) => ({
        slug: slug,
      }))
  );
}

export default async function BytePage({ params: { slug } }: BytePageProps) {
  const byte: Byte | undefined = await FirebaseService.getInstance().then(
    (firebaseService) => firebaseService.getByte(slug)
  );

  if (!byte) return <main>Byte not found</main>;

  const publishDateString: string = getDateString(byte.publishDate);
  const lastModifiedDateString: string = getDateString(byte.lastModifiedDate);

  return (
    <main
      className={`grid justify-self-center pt-5 ${theme.pageWidth} ${theme.pageBottomMargin}`}
    >
      <p className={`text-5xl font-bold ${theme.secondaryColourText}`}>
        {byte.title}
      </p>
      <p className={`text-2xl ${theme.tertiaryColourText}`}>{byte.subtitle}</p>
      <p className={`${theme.dateStyle}`}>Published: {publishDateString}</p>
      {publishDateString !== lastModifiedDateString && (
        <p className={`${theme.dateStyle}`}>
          Last modified: {lastModifiedDateString}
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
