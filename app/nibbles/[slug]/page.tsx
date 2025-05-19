import React from "react";
import FirebaseService from "@/common/FirebaseService";
import { getDateString } from "@/common/timeUtils";
import { theme } from "@/common/theme";
import { METADATA_DESCRIPTION_CREDITS, WEBSITE_NAME } from "@/common/constants";
import { Metadata } from "next";
import Link from "next/link";
import { Ingredient, Nibble } from "@/common/Nibble";
import HighlightedText from "@/common/HighlightedText";
import { getDisplayTime } from "../timeUtils";

type RouteParams = {
  slug: string;
};

type NibblePageProps = {
  params: Promise<RouteParams>;
};

/**
 * Retrieves all nibble slugs from Firebase and returns them as route parameters for static page generation.
 *
 * @returns An array of objects each containing a nibble slug for use in static routing.
 */
export async function generateStaticParams(): Promise<RouteParams[]> {
  return await FirebaseService.getInstance().then(
    (firebaseService: FirebaseService): RouteParams[] =>
      firebaseService
        .getNibbleSlugs()
        .map((slug: string): RouteParams => ({ slug }))
  );
}

/**
 * Generates metadata for a nibble recipe page based on the provided slug.
 *
 * Retrieves the nibble's title from the database and constructs a metadata object with a formatted title and description for SEO purposes.
 *
 * @returns Metadata object containing the page title and description.
 */
export async function generateMetadata({
  params,
}: NibblePageProps): Promise<Metadata> {
  const { slug }: RouteParams = await params;

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

/**
 * Renders a detailed recipe page for a specific "Nibble" based on the provided slug.
 *
 * Displays the nibble's title, publication and modification dates, cover photo, servings, preparation time, source attribution, ingredients, and step-by-step instructions. If the nibble is not found, shows a "Nibble not found" message.
 *
 * @param params - An object containing the nibble's slug for lookup.
 * @returns The rendered recipe page as a React component, or a not-found message if the nibble does not exist.
 */
export default async function NibblePage({ params }: NibblePageProps) {
  const { slug }: RouteParams = await params;

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
      className={`grid justify-self-center pt-5 ${theme.layout.page.width} ${theme.layout.page.bottomMargin}`}
    >
      <p
        className={`text-5xl font-bold ${headingSpacing} ${theme.colours.secondary.text}`}
      >
        {nibble.title}
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
        src={nibble.coverPhoto}
        alt={nibble.title}
        className={`justify-self-center w-fit mt-2 sm:mt-6 mb-3`}
      />
      <p className={`text-l ${headingSpacing}`}>
        Serves: <HighlightedText>{nibble.nServings}</HighlightedText>
      </p>
      <p className={`text-l ${headingSpacing}`}>
        This took me:{" "}
        <HighlightedText>
          {getDisplayTime(nibble.timeTakenMinutes)}
        </HighlightedText>
      </p>
      <p className={`text-l ${headingSpacing}`}>
        Adapted from:{" "}
        <span className={theme.colours.secondary.text}>
          {isSourceUrl ? (
            <a href={nibble.source} target="_blank" rel="noopener noreferrer">
              {nibble.source}
            </a>
          ) : (
            nibble.source
          )}
        </span>
      </p>
      <div className="my-4">
        <p className={`text-2xl mb-2 ${theme.colours.tertiary.text}`}>
          Ingredients
        </p>
        <ul className={theme.colours.secondary.text}>
          {nibble.ingredients.map(renderIngredient)}
        </ul>
      </div>
      <div className="mt-4">
        <p className={`text-2xl mb-2 ${theme.colours.tertiary.text}`}>Steps</p>
        <ol className={theme.colours.secondary.text}>
          {nibble.steps.map(
            (step: string): JSX.Element => (
              <li className={`pb-2`} key={step}>
                <span className={theme.colours.tertiary.text}>{step}</span>
              </li>
            )
          )}
        </ol>
      </div>
    </div>
  );
}

const renderIngredient = (ingredient: Ingredient): JSX.Element => {
  let suffix: string = "";
  if (ingredient.quantity || ingredient.measurement) {
    suffix = "-";

    if (ingredient.quantity) {
      suffix += ` ${ingredient.quantity}`;
    }

    if (ingredient.measurement) {
      suffix += ` ${ingredient.measurement}`;
    }
  }

  return (
    <li className={theme.colours.tertiary.text} key={ingredient.name}>
      <HighlightedText>{ingredient.name}</HighlightedText> {suffix}
      {ingredient.optional && <span className="text-white"> (optional)</span>}
    </li>
  );
};
