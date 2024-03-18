import React from "react";
import "@testing-library/jest-dom";
import FirebaseService from "@/common/firebaseService";
import { render, screen } from "@testing-library/react";
import { mocked, MockedFunction } from "jest-mock";
import BytePage, { generateStaticParams } from "./page";
import { Byte, SectionType } from "@/common/Byte";
import Section from "./Section";
import { getDateString } from "@/common/timeUtils";

jest.mock("@/utils/firebaseService");
jest.mock("@/utils/timeUtils");
jest.mock("@/components/tilecard");
jest.mock("./Section");

let firebaseGetInstanceMock: MockedFunction<() => Promise<FirebaseService>>;
let byte: Byte;
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

    byte = {
      title: "Blog title",
      subtitle: "Blog subtitle",
      series: {title: "My series", accentColour: "#ac3Ef"},
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
            {
              type: "code",
              value: { language: "Python", code: "print('Hello world!')" },
            },
          ],
        },
      ],
    };
    getByteMock = mocked(FirebaseService.prototype.getByte);

    getDateStringMock = mocked(getDateString);
  });

  sectionMock = mocked(Section);
  sectionMock.mockImplementation((props: SectionType) => {
    return <p>{props.title}</p>;
  });

  it("should use slugs for static params", async () => {
    const mockSlugs: string[] = ["slug-1", "slug-2"];
    const getSlugsMock: MockedFunction<() => string[]> = mocked(
      FirebaseService.prototype.getSlugs
    );
    getSlugsMock.mockReturnValue(mockSlugs);

    const params: { slug: string }[] = await generateStaticParams();

    expect(firebaseGetInstanceMock).toHaveBeenCalledTimes(1);
    expect(getSlugsMock).toHaveBeenCalledTimes(1);

    expect(params).toEqual(mockSlugs.map((slug) => ({ slug })));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the page with separate publish and last modified date correctly", async () => {
    const publishDateString = "22/02/24";
    const lastModifiedDateString = "23/02/24";
    getDateStringMock.mockImplementation((date: Date): string => {
      if (date === byte.publishDate) {
        return publishDateString;
      } else if (date === byte.lastModifiedDate) {
        return lastModifiedDateString;
      } else {
        throw new Error("Unexpected date passed to getDateString function");
      }
    });

    getByteMock.mockReturnValue(byte);

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

    // both publish date and last modified date should be displayed
    expect(
      screen.getByText(publishDateString, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(lastModifiedDateString, { exact: false })
    ).toBeInTheDocument();

    expect(sectionMock).toHaveBeenCalledTimes(2);
    expect(screen.getByText(byte.sections[0].title)).toBeInTheDocument();
    expect(screen.getByText(byte.sections[1].title)).toBeInTheDocument();

    expect(screen.getByText(byte.series.title)).toBeInTheDocument();
    expect(screen.getByText(byte.series.title)).toHaveStyle({"background-color": byte.series.accentColour})
  });

  it("should render the page with the same publish and last modified date correctly", async () => {
    const dateString = "20/02/24";
    getDateStringMock.mockImplementation((date: Date): string => {
      if (date === byte.publishDate || date === byte.lastModifiedDate) {
        return dateString;
      } else {
        throw new Error("Unexpected date passed to getDateString function");
      }
    });

    getByteMock.mockReturnValue(byte);

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

    // either publish date or last modified date should be displayed. Not both
    expect(screen.getByText(dateString, { exact: false })).toBeInTheDocument();
    expect(screen.getAllByText(dateString, { exact: false }).length).toEqual(1);

    expect(sectionMock).toHaveBeenCalledTimes(2);
    expect(screen.getByText(byte.sections[0].title)).toBeInTheDocument();
    expect(screen.getByText(byte.sections[1].title)).toBeInTheDocument();
  });

  it("should render an error message if no byte is found", async () => {
    getByteMock.mockReturnValue(undefined);

    const jsx = await BytePage({
      params: {
        slug: byte.slug,
      },
    });
    render(jsx);

    expect(screen.getByText("Byte not found")).toBeInTheDocument();
  });
});
