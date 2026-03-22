import React, { FC } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import BytesPage from "./page";
import type { MockedFunction } from "vitest";
import FirebaseService from "@/common/FirebaseService";
import { ByteOverviewType } from "@bytes-and-nibbles/shared";
import Tilecard, { TilecardProps } from "@/tilecard/Tilecard";
import TilecardSubheading, {
  TilecardSubheadingProps,
} from "./TilecardSubheading";

vi.mock("@/common/FirebaseService");
vi.mock("@/tilecard/Tilecard");
vi.mock("./TilecardSubheading");

let firebaseGetInstanceMock: MockedFunction<() => Promise<FirebaseService>>;
let listBytesMock: MockedFunction<() => ByteOverviewType[]>;
let byteOverviewsMock: ByteOverviewType[];
let byteTilecardSubheadingMock: MockedFunction<FC<TilecardSubheadingProps>>;
let tilecardMock: MockedFunction<FC<TilecardProps>>;

describe("Bytes page", () => {
  beforeAll(() => {
    firebaseGetInstanceMock = vi.mocked(FirebaseService.getInstance);
    firebaseGetInstanceMock.mockReturnValue(
      Promise.resolve(FirebaseService.prototype)
    );

    byteOverviewsMock = [
      {
        title: "Title 1",
        subtitle: "Subtitle 1",
        series: { title: "Series 1", accentColour: "#ac3Ef" },
        thumbnail: "Thumbnail 1",
        publishDate: new Date(2024, 2, 5),
        slug: "slug-1",
      },
      {
        title: "Title 2",
        subtitle: "Subtitle 2",
        series: { title: "Series 2", accentColour: "#FC3Ef" },
        thumbnail: "Thumbnail 2",
        publishDate: new Date(2024, 3, 6),
        slug: "slug-2",
      },
    ];
    listBytesMock = vi.mocked(FirebaseService.prototype.listBytes);
    listBytesMock.mockReturnValue(byteOverviewsMock);

    tilecardMock = vi.mocked(Tilecard);
    tilecardMock.mockImplementation(({ title, children }: TilecardProps) => {
      return (
        <div>
          <p>{title}</p>
          {children}
        </div>
      );
    });

    byteTilecardSubheadingMock = vi.mocked(TilecardSubheading);
    byteTilecardSubheadingMock.mockImplementation(
      ({ subtitle }: TilecardSubheadingProps) => {
        return <p>{subtitle}</p>;
      }
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should should render all of the tilecards", async () => {
    render(await BytesPage());

    await waitFor((): void => {
      expect(listBytesMock).toHaveBeenCalledTimes(1);
    });

    byteOverviewsMock.forEach((byteOverview: ByteOverviewType): void => {
      expect(screen.getByText(byteOverview.title)).toBeInTheDocument();
      expect(screen.getByText(byteOverview.subtitle)).toBeInTheDocument();
    });
  });
});
