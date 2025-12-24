import "@testing-library/jest-dom";
import FirebaseService from "@/common/FirebaseService";
import { Matcher, render, screen } from "@testing-library/react";
import { mocked, MockedFunction } from "jest-mock";
import { getDateString } from "@/common/timeUtils";
import { NibbleType } from "@bytes-and-nibbles/shared";
import NibblePage, { generateMetadata, generateStaticParams } from "./page";
import { Metadata } from "next";
import { METADATA_DESCRIPTION_CREDITS, WEBSITE_NAME } from "@/common/constants";

jest.mock("@/common/FirebaseService");
jest.mock("@/common/timeUtils");
jest.mock("@/tilecard/Tilecard");

let firebaseGetInstanceMock: MockedFunction<() => Promise<FirebaseService>>;
const nibbleExample: NibbleType = {
  title: "My title",
  thumbnail: "Thumbnail src",
  coverPhoto: "Cover photo src",
  slug: "nibble-slug",
  nServings: 5,
  source: "https://my-source.co.uk",
  ingredients: [
    {
      name: "Tomatoes",
      quantity: 2,
      measurement: "",
      optional: false,
    },
    {
      name: "Double cream",
      quantity: 5,
      measurement: "tbsp",
      optional: true,
    },
  ],
  steps: ["Dice tomatoes.", "Add cream.", "Blend and serve"],
  publishDate: new Date("12/03/22"),
  lastModifiedDate: new Date("04/09/27"),
  timeTakenMinutes: 80,
};
let getNibbleMock: MockedFunction<(slug: string) => NibbleType | undefined>;
let getDateStringMock: MockedFunction<(date: Date) => string>;

describe("Individual nibbles page", () => {
  beforeAll(() => {
    // set up firebaseService mock
    firebaseGetInstanceMock = mocked(FirebaseService.getInstance);
    firebaseGetInstanceMock.mockReturnValue(
      Promise.resolve(FirebaseService.prototype)
    );

    getNibbleMock = mocked(FirebaseService.prototype.getNibble);

    getDateStringMock = mocked(getDateString);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should use slugs for static params", async () => {
    const mockSlugs: string[] = ["slug-1", "slug-2"];
    const getSlugsMock: MockedFunction<() => string[]> = mocked(
      FirebaseService.prototype.getNibbleSlugs
    );
    getSlugsMock.mockReturnValue(mockSlugs);

    const params: { slug: string }[] = await generateStaticParams();

    expect(firebaseGetInstanceMock).toHaveBeenCalledTimes(1);
    expect(getSlugsMock).toHaveBeenCalledTimes(1);

    expect(params).toEqual(mockSlugs.map((slug) => ({ slug })));
  });

  it.each([nibbleExample, undefined])(
    "should use apply the appropriate metadata",
    async (nibble: NibbleType | undefined) => {
      getNibbleMock.mockReturnValue(nibble);

      const metadata: Metadata = await generateMetadata({
        params: Promise.resolve({ slug: nibbleExample.slug }),
      });

      expect(firebaseGetInstanceMock).toHaveBeenCalledTimes(1);
      expect(getNibbleMock).toHaveBeenCalledTimes(1);

      const expectedTitle = nibble ? nibble.title : "Untitled nibble";
      expect(metadata.title).toEqual(`${expectedTitle} - ${WEBSITE_NAME}`);
      expect(metadata.description).toEqual(
        `The recipe: ${expectedTitle}. ${METADATA_DESCRIPTION_CREDITS}`
      );
    }
  );

  it.each([
    {
      ...nibbleExample,
      publishDate: new Date("11/02/24"),
      lastModifiedDate: new Date("11/04/24"),
    },
    {
      ...nibbleExample,
      publishDate: new Date("07/02/24"),
      lastModifiedDate: new Date("07/02/24"),
    },
    {
      ...nibbleExample,
      source: "My non-URL source",
    },
  ])("should render pages correctly", async (nibble: NibbleType) => {
    getNibbleMock.mockReturnValue(nibble);

    getDateStringMock.mockImplementation((date: Date): string =>
      date.toDateString()
    );

    const jsx = await NibblePage({
      params: Promise.resolve({
        slug: nibble.slug,
      }),
    });
    render(jsx);

    expect(firebaseGetInstanceMock).toHaveBeenCalledTimes(1);
    expect(getNibbleMock).toHaveBeenCalledTimes(1);
    expect(getNibbleMock).toHaveBeenCalledWith(nibble.slug);

    expect(getDateStringMock).toHaveBeenCalledTimes(2);
    expect(getDateStringMock).toHaveBeenCalledWith(nibble.publishDate);
    expect(getDateStringMock).toHaveBeenCalledWith(nibble.lastModifiedDate);

    expect(screen.getByText(nibble.title)).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", nibble.coverPhoto);

    expect(
      screen.getByText(nibble.publishDate.toDateString(), { exact: false })
    ).toBeInTheDocument();
    if (nibble.publishDate === nibble.lastModifiedDate) {
      expect(
        screen.getAllByText(nibble.lastModifiedDate.toDateString(), {
          exact: false,
        }).length
      ).toEqual(1);
    } else {
      expect(
        screen.getByText(nibble.lastModifiedDate.toDateString(), {
          exact: false,
        })
      ).toBeInTheDocument();
    }

    expect(
      screen.getByText(textContent(`Adapted from: ${nibble.source}`))
    ).toBeInTheDocument();
    if (nibble.source.slice(0, 4) === "http") {
      expect(screen.getByRole("link")).toBeInTheDocument();
      expect(screen.getByRole("link")).toHaveTextContent(nibble.source);
    } else {
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    }

    expect(
      screen.getByText(textContent(`Serves: ${nibble.nServings}`))
    ).toBeInTheDocument();

    nibble.ingredients.forEach((ingredient) => {
      let suffix = "-";

      if (ingredient.quantity) {
        suffix += ` ${ingredient.quantity}`;
      }

      if (ingredient.measurement) {
        suffix += ` ${ingredient.measurement}`;
      }

      expect(
        screen.getByText(
          textContent(
            `${ingredient.name} ${suffix}${
              ingredient.optional ? " (optional)" : ""
            }`
          )
        )
      ).toBeInTheDocument();
    });

    nibble.steps.forEach((step) => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });
  });

  it("should render an error message if no nibble is found", async () => {
    getNibbleMock.mockReturnValue(undefined);

    const jsx = await NibblePage({
      params: Promise.resolve({
        slug: nibbleExample.slug,
      }),
    });
    render(jsx);

    expect(screen.getByText("Nibble not found")).toBeInTheDocument();
  });
});

const textContent = (expectedContent: string): Matcher => {
  return (_: string, element: Element | null): boolean =>
    element?.textContent === expectedContent;
};
