import React from "react";
import FirebaseService from "@/common/FirebaseService";
import { getDateString } from "@/common/timeUtils";
import { METADATA_DESCRIPTION_CREDITS, WEBSITE_NAME } from "@/common/constants";
import { Metadata } from "next";
import { IngredientType, NibbleSchema } from "@bytes-and-nibbles/shared";
import HighlightedText from "@/common/HighlightedText";
import { getDisplayTime } from "@/common/timeUtils";
import { Separator } from "@/components/ui/separator";

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
        .map((slug: string): RouteParams => ({ slug })),
  );
}

export async function generateMetadata({
  params,
}: NibblePageProps): Promise<Metadata> {
  const { slug }: RouteParams = await params;

  const title: string = await FirebaseService.getInstance().then(
    (firebaseService: FirebaseService): string => {
      const nibble: NibbleSchema | undefined = firebaseService.getNibble(slug);

      return nibble ? nibble.title : "Untitled nibble";
    },
  );

  return {
    title: `${title} - ${WEBSITE_NAME}`,
    description: `The recipe: ${title}. ${METADATA_DESCRIPTION_CREDITS}`,
  };
}

export default async function NibblePage({ params }: NibblePageProps) {
  const { slug }: RouteParams = await params;

  const nibble: NibbleSchema | undefined =
    await FirebaseService.getInstance().then(
      (firebaseService: FirebaseService): NibbleSchema | undefined =>
        firebaseService.getNibble(slug),
    );

  if (!nibble)
    return <p className="text-center text-xl p-10">Nibble not found</p>;

  const publishDateString: string = getDateString(nibble.publishDate);
  const lastModifiedDateString: string = getDateString(nibble.lastModifiedDate);

  const isSourceUrl = nibble.source.slice(0, 4) === "http";

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 mb-10">
      <h1 className="text-5xl font-bold mb-2 text-primary">{nibble.title}</h1>
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
        src={nibble.coverPhoto}
        alt={nibble.title}
        className="w-full h-auto rounded-lg shadow-md mb-6 object-cover"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-card rounded-lg border text-card-foreground">
          <p className="text-lg font-semibold mb-1">Serves</p>
          <HighlightedText>{nibble.nServings}</HighlightedText>
        </div>
        <div className="p-4 bg-card rounded-lg border text-card-foreground">
          <p className="text-lg font-semibold mb-1">Time Taken</p>
          <HighlightedText>
            {getDisplayTime(nibble.timeTakenMinutes)}
          </HighlightedText>
        </div>
      </div>

      <p className="text-muted-foreground mb-8">
        Adapted from:{" "}
        <span className="text-primary hover:underline">
          {isSourceUrl ? (
            <a href={nibble.source} target="_blank" rel="noopener noreferrer">
              {nibble.source}
            </a>
          ) : (
            nibble.source
          )}
        </span>
      </p>

      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4 text-primary">Ingredients</h2>
        <ul className="list-disc pl-5 space-y-2 text-foreground">
          {nibble.ingredients.map(renderIngredient)}
        </ul>
      </div>

      <Separator className="my-8" />

      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4 text-primary">Steps</h2>
        <ol className="list-decimal pl-5 space-y-4 text-foreground">
          {nibble.steps.map((step: string, index: number) => (
            <li key={index} className="pl-2">
              <span className="text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

const renderIngredient = (ingredient: IngredientType): React.JSX.Element => {
  let suffix: string = "";
  if (ingredient.quantity || ingredient.measurement) {
    suffix = " -";

    if (ingredient.quantity) {
      suffix += ` ${ingredient.quantity}`;
    }

    if (ingredient.measurement) {
      suffix += ` ${ingredient.measurement}`;
    }
  }

  return (
    <li className="text-muted-foreground" key={ingredient.name}>
      <span className="font-medium text-foreground">{ingredient.name}</span>
      {suffix}
      {ingredient.optional && (
        <span className="text-muted-foreground/70 italic"> (optional)</span>
      )}
    </li>
  );
};
