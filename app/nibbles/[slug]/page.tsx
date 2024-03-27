import React from "react";
import FirebaseService from "@/common/FirebaseService";
import { getDateString } from "@/common/timeUtils";
import {
  PAGE_BOTTOM_MARGIN,
  PAGE_WIDTH,
  SECONDARY_COLOUR_TEXT,
  TERTIARY_COLOUR_TEXT,
} from "@/common/theme";
import { METADATA_DESCRIPTION_CREDITS, WEBSITE_NAME } from "@/common/constants";
import { Metadata } from "next";
import { Ingredient, Nibble } from "@/common/Nibble";

type RouteParams = {
  slug: string;
};

type NibblePageProps = {
  params: RouteParams;
};

export async function generateStaticParams(): Promise<RouteParams[]> {
  return await FirebaseService.getInstance().then(
    (firebaseService: FirebaseService): RouteParams[] =>
      firebaseService
        .getNibbleSlugs()
        .map((slug: string): RouteParams => ({ slug }))
  );
}

export async function generateMetadata({
  params: { slug },
}: NibblePageProps): Promise<Metadata> {
  const title: string = await FirebaseService.getInstance().then(
    (firebaseService: FirebaseService): string => {
      const nibble: Nibble | undefined = firebaseService.getNibble(slug);

      return nibble ? nibble.title : "Untitled nibble";
    }
  );

  return {
    title: `${title} - ${WEBSITE_NAME}`,
    description: `The recipe: ${title}. ${METADATA_DESCRIPTION_CREDITS}`,
  };
}

export default async function NibblePage({
  params: { slug },
}: NibblePageProps) {
  const nibble: Nibble | undefined = await FirebaseService.getInstance().then(
    (firebaseService: FirebaseService): Nibble | undefined =>
      firebaseService.getNibble(slug)
  );

  if (!nibble) return <p>Nibble not found</p>;

  const publishDateString: string = getDateString(nibble.publishDate);
  const lastModifiedDateString: string = getDateString(nibble.lastModifiedDate);

  const headingSpacing = "mb-1";

  const isSourceUrl = nibble.source.slice(0, 4) === "http";

  return (
    <div
      className={`grid justify-self-center pt-5 ${PAGE_WIDTH} ${PAGE_BOTTOM_MARGIN}`}
    >
      <p
        className={`text-5xl font-bold ${headingSpacing} ${SECONDARY_COLOUR_TEXT}`}
      >
        {nibble.title}
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
        src={nibble.coverPhoto}
        alt={nibble.title}
        className={`justify-self-center w-fit mt-2 sm:mt-6 mb-3`}
      />
      <p className={`text-l ${headingSpacing}`}>
        This took me{" "}
        <span className={SECONDARY_COLOUR_TEXT}>
          {nibble.timeTakenMinutes} minutes
        </span>
      </p>
      <p className={`text-l ${headingSpacing}`}>
        Adapted from{" "}
        <span className={SECONDARY_COLOUR_TEXT}>
          {isSourceUrl ? (
            <a href={nibble.source}>{nibble.source}</a>
          ) : (
            nibble.source
          )}
        </span>
      </p>
      <div className="my-4">
        <p className={`text-2xl font-underline mb-2 ${TERTIARY_COLOUR_TEXT}`}>
          Ingredients
        </p>
        <ul className={`list-inside ${SECONDARY_COLOUR_TEXT}`}>
          {nibble.ingredients.map(
            (ingredient: Ingredient): JSX.Element => (
              <li className={TERTIARY_COLOUR_TEXT} key={ingredient.name}>
                <span className={SECONDARY_COLOUR_TEXT}>{ingredient.name}</span>{" "}
                - {ingredient.quantity}
                {ingredient.measurement ? ` ${ingredient.measurement}` : ""}
              </li>
            )
          )}
        </ul>
      </div>
      <div className="mt-4">
        <p className={`text-2xl font-underline mb-2 ${TERTIARY_COLOUR_TEXT}`}>
          Steps
        </p>
        <ol className={`list-inside ${SECONDARY_COLOUR_TEXT}`}>
          {React.Children.toArray(
            nibble.steps.map(
              (step: string): JSX.Element => (
                <li className={`pb-2`}>
                  <span className={TERTIARY_COLOUR_TEXT}>{step}</span>
                </li>
              )
            )
          )}
        </ol>
      </div>
    </div>
  );
}
