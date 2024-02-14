import React from "react";
import { Byte } from "@/app/utils/Byte";
import FirebaseService from "@/app/utils/firebaseService";
import { theme } from "@/app/utils/theme";
import { getDateString } from "@/app/utils/timeUtils";
import Section from "./Section";

export async function generateStaticParams() {
  const firebaseService: FirebaseService = FirebaseService.getInstance();
  const slugs = await firebaseService.getSlugs();

  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const firebaseService: FirebaseService = FirebaseService.getInstance();
  const byte: Byte | undefined = await firebaseService.getByte(params.slug);

  if (!byte) return <main>Byte not found</main>;

  const publishDateString: string = getDateString(byte.publishDate);
  const lastModifiedDateString: string = getDateString(byte.lastModifiedDate);

  return (
    <main
      className={`grid justify-self-center pt-5 ${theme.pageWidth} ${theme.pageBottomMargin}`}
    >
      <p
        className={`${theme.titleStyle} font-bold ${theme.secondaryColourText}`}
      >
        {byte.title}
      </p>
      <p className={`${theme.tertiaryColourText} ${theme.subtitleStyle}`}>
        {byte.subtitle}
      </p>
      <p className={`${theme.dateStyle}`}>Published: {publishDateString}</p>
      {publishDateString !== lastModifiedDateString && (
        <p className={`${theme.dateStyle}`}>
          Last modified: {lastModifiedDateString}
        </p>
      )}
      <img
        src={byte.coverPhoto}
        alt={byte.title}
        className={`justify-self-center w-fit ${theme.coverPhoto}`}
      />
      {React.Children.toArray(byte.sections.map(Section))}
    </main>
  );
}
