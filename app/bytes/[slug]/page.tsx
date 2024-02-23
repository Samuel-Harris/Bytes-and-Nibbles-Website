import React from "react";
import { Byte } from "@/utils/Byte";
import FirebaseService from "@/utils/firebaseService";
import theme from "@/utils/theme";
import { getDateString } from "@/utils/timeUtils";
import Section from "./Section";

export async function generateStaticParams() {
  const firebaseService: FirebaseService = FirebaseService.getInstance();
  const slugs: string[] = await firebaseService.getSlugs();

  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export default async function BytePage({ params }: { params: { slug: string } }) {
  const firebaseService: FirebaseService = FirebaseService.getInstance();
  const byte: Byte | undefined = await firebaseService.getByte(params.slug);

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
