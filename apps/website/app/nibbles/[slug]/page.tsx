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
import { IngredientType, NibbleType } from "@bytes-and-nibbles/shared";
import HighlightedText from "@/common/HighlightedText";
import { getDisplayTime } from "../timeUtils";

type RouteParams = {
  slug: string;
};

type NibblePageProps = {
  params: Promise<RouteParams>;
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
  params,
}: NibblePageProps): Promise<Metadata> {
  const { slug }: RouteParams = await params;

  const title: string = await FirebaseService.getInstance().then(
    (firebaseService: FirebaseService): string => {
      const nibble: NibbleType | undefined = firebaseService.getNibble(slug);

      return nibble ? nibble.title : "Untitled nibble";
    }
  );

  return {
    title: `${title} - ${WEBSITE_NAME}`,
    description: `The recipe: ${title}. ${METADATA_DESCRIPTION_CREDITS}`,
  };
}

export default async function NibblePage({ params }: NibblePageProps) {
  const { slug }: RouteParams = await params;

  const nibble: NibbleType | undefined = await FirebaseService.getInstance().then(
    (firebaseService: FirebaseService): NibbleType | undefined =>
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
      <p className={`mb-1 text-md`}>
        <span className={TERTIARY_COLOUR_TEXT}>Published: </span>
        {publishDateString}
      </p>
      {publishDateString !== lastModifiedDateString && (
        <p className={`text-md`}>
          <span className={TERTIARY_COLOUR_TEXT}>Last modified: </span>
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
        <span className={SECONDARY_COLOUR_TEXT}>
          {isSourceUrl ? (
            <a href={nibble.source}>{nibble.source}</a>
          ) : (
            nibble.source
          )}
        </span>
      </p>
      <div className="my-4">
        <p className={`text-2xl mb-2 ${TERTIARY_COLOUR_TEXT}`}>Ingredients</p>
        <ul className={SECONDARY_COLOUR_TEXT}>
          {nibble.ingredients.map(renderIngredient)}
        </ul>
      </div>
      <div className="mt-4">
        <p className={`text-2xl mb-2 ${TERTIARY_COLOUR_TEXT}`}>Steps</p>
        <ol className={SECONDARY_COLOUR_TEXT}>
          {nibble.steps.map(
            (step: string): JSX.Element => (
              <li className={`pb-2`} key={step}>
                <span className={TERTIARY_COLOUR_TEXT}>{step}</span>
              </li>
            )
          )}
        </ol>
      </div>
    </div>
  );
}

const renderIngredient = (ingredient: IngredientType): JSX.Element => {
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
    <li className={TERTIARY_COLOUR_TEXT} key={ingredient.name}>
      <HighlightedText>{ingredient.name}</HighlightedText> {suffix}
      {ingredient.optional && <span className="text-white"> (optional)</span>}
    </li>
  );
};
