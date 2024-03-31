import React from "react";
import "@testing-library/jest-dom";
import FirebaseService from "@/common/FirebaseService";
import { render, screen } from "@testing-library/react";
import { mocked, MockedFunction } from "jest-mock";
import BytePage, { generateMetadata, generateStaticParams } from "./page";
import { Byte, SectionType } from "@/common/Byte";
import Section from "./Section";
import { getDateString } from "@/common/timeUtils";
import { Metadata } from "next";
import { METADATA_DESCRIPTION_CREDITS, WEBSITE_NAME } from "@/common/constants";

jest.mock("@/common/FirebaseService");
jest.mock("@/common/timeUtils");
jest.mock("@/tilecard/Tilecard");
jest.mock("./Section");

let firebaseGetInstanceMock: MockedFunction<() => Promise<FirebaseService>>;
const byteExample: Byte = {
  title: "Blog title",
  subtitle: "Blog subtitle",
  series: { title: "My series", accentColour: "#ac3Ef" },
  slug: "my-blog-page",
  thumbnail: "Thumbnail src",
  coverPhoto: "Cover photo src",
  publishDate: new Date(2024, 2, 20),
  lastModifiedDate: new Date(2024, 2, 20),
  sections: [
    {
      title: "Section 1",
      body: [
        {
          type: "paragraph",
          value: "string",
        },
      ],
    },
    {
      title: "Section 2",
      body: [
        {
          type: "captionedImage",
          value: { image: "Image src", caption: "Image caption" },
        },
      ],
    },
  ],
};
let getByteMock: MockedFunction<(slug: string) => Byte | undefined>;
let getDateStringMock: MockedFunction<(date: Date) => string>;
let sectionMock: MockedFunction<React.FC<SectionType>>;

describe("Individual byte page", () => {
  beforeAll(() => {
    // set up firebaseService mock
    firebaseGetInstanceMock = mocked(FirebaseService.getInstance);
    firebaseGetInstanceMock.mockReturnValue(
      Promise.resolve(FirebaseService.prototype)
    );

    getByteMock = mocked(FirebaseService.prototype.getByte);

    getDateStringMock = mocked(getDateString);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  sectionMock = mocked(Section);
  sectionMock.mockImplementation(({ title }: SectionType) => {
    return <p>{title}</p>;
  });

  it("should use slugs for static params", async () => {
    const mockSlugs: string[] = ["slug-1", "slug-2"];
    const getSlugsMock: MockedFunction<() => string[]> = mocked(
      FirebaseService.prototype.getByteSlugs
    );
    getSlugsMock.mockReturnValue(mockSlugs);

    const params: { slug: string }[] = await generateStaticParams();

    expect(firebaseGetInstanceMock).toHaveBeenCalledTimes(1);
    expect(getSlugsMock).toHaveBeenCalledTimes(1);

    expect(params).toEqual(mockSlugs.map((slug) => ({ slug })));
  });

  it.each([byteExample, undefined])(
    "should use apply the appropriate metadata",
    async (byte: Byte | undefined) => {
      getByteMock.mockReturnValue(byte);

      const metadata: Metadata = await generateMetadata({
        params: { slug: byteExample.slug },
      });

      expect(firebaseGetInstanceMock).toHaveBeenCalledTimes(1);
      expect(getByteMock).toHaveBeenCalledTimes(1);

      const expectedTitle = byte ? byte.title : "Untitled byte";
      expect(metadata.title).toEqual(`${expectedTitle} - ${WEBSITE_NAME}`);
      expect(metadata.description).toEqual(
        `The coding blog: ${expectedTitle}. ${METADATA_DESCRIPTION_CREDITS}`
      );
    }
  );

  it.each([
    {
      ...byteExample,
      publishDate: new Date("11/02/24"),
      lastModifiedDate: new Date("11/04/24"),
    },
    {
      ...byteExample,
      publishDate: new Date("03/09/23"),
      lastModifiedDate: new Date("03/09/23"),
    },
  ])(
    "should render pages with differing publish and last modified dates correctly",
    async (byte: Byte) => {
      getByteMock.mockReturnValue(byte);

      getDateStringMock.mockImplementation((date: Date): string =>
        date.toDateString()
      );

      const jsx = await BytePage({
        params: {
          slug: byte.slug,
        },
      });
      render(jsx);

      expect(firebaseGetInstanceMock).toHaveBeenCalledTimes(1);
      expect(getByteMock).toHaveBeenCalledTimes(1);
      expect(getByteMock).toHaveBeenCalledWith(byte.slug);

      expect(getDateStringMock).toHaveBeenCalledTimes(2);
      expect(getDateStringMock).toHaveBeenCalledWith(byte.publishDate);
      expect(getDateStringMock).toHaveBeenCalledWith(byte.lastModifiedDate);

      expect(screen.getByText(byte.title)).toBeInTheDocument();
      expect(screen.getByText(byte.subtitle)).toBeInTheDocument();
      expect(screen.getByRole("img")).toHaveAttribute("src", byte.coverPhoto);

      expect(
        screen.getByText(byte.publishDate.toDateString(), { exact: false })
      ).toBeInTheDocument();
      if (byte.publishDate === byte.lastModifiedDate) {
        expect(
          screen.getAllByText(byte.lastModifiedDate.toDateString(), {
            exact: false,
          }).length
        ).toEqual(1);
      } else {
        expect(
          screen.getByText(byte.lastModifiedDate.toDateString(), {
            exact: false,
          })
        ).toBeInTheDocument();
      }

      expect(sectionMock).toHaveBeenCalledTimes(2);
      expect(screen.getByText(byte.sections[0].title)).toBeInTheDocument();
      expect(screen.getByText(byte.sections[1].title)).toBeInTheDocument();

      expect(screen.getByText(byte.series.title)).toBeInTheDocument();
      expect(screen.getByText(byte.series.title)).toHaveStyle({
        "background-color": byte.series.accentColour,
      });
    }
  );

  it("should render an error message if no byte is found", async () => {
    getByteMock.mockReturnValue(undefined);

    const jsx = await BytePage({
      params: {
        slug: byteExample.slug,
      },
    });
    render(jsx);

    expect(screen.getByText("Byte not found")).toBeInTheDocument();
  });
});
