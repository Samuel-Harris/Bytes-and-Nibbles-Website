import React, { FC } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import BytesPage from "./page";
import FirebaseService from "@/common/FirebaseService";
import { mocked, MockedFunction } from "jest-mock";
import "@testing-library/jest-dom";
import { ByteOverview } from "@/common/Byte";
import Tilecard, { TilecardProps } from "@/tilecard/Tilecard";
import TilecardSubheading, {
  TilecardSubheadingProps,
} from "./TilecardSubheading";

jest.mock("@/common/FirebaseService");
jest.mock("@/tilecard/Tilecard");
jest.mock("./TilecardSubheading");

let firebaseGetInstanceMock: MockedFunction<() => Promise<FirebaseService>>;
let listBytesMock: MockedFunction<() => ByteOverview[]>;
let byteOverviewsMock: ByteOverview[];
let byteTilecardSubheadingMock: MockedFunction<FC<TilecardSubheadingProps>>;
let tilecardMock: MockedFunction<FC<TilecardProps>>;

describe("Bytes page", () => {
  beforeAll(() => {
    firebaseGetInstanceMock = mocked(FirebaseService.getInstance);
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
    listBytesMock = mocked(FirebaseService.prototype.listBytes);
    listBytesMock.mockReturnValue(byteOverviewsMock);

    tilecardMock = mocked(Tilecard);
    tilecardMock.mockImplementation((props: TilecardProps) => {
      return (
        <div>
          <p>{props.title}</p>
          {props.children}
        </div>
      );
    });

    byteTilecardSubheadingMock = mocked(TilecardSubheading);
    byteTilecardSubheadingMock.mockImplementation(
      (props: TilecardSubheadingProps) => {
        return <p>{props.subtitle}</p>;
      }
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should should render all of the tilecards", async () => {
    render(await BytesPage());

    await waitFor((): void => {
      expect(listBytesMock).toHaveBeenCalledTimes(1);
    });

    byteOverviewsMock.forEach((byteOverview: ByteOverview): void => {
      expect(screen.getByText(byteOverview.title)).toBeInTheDocument();
      expect(screen.getByText(byteOverview.subtitle)).toBeInTheDocument();
    });
  });
});
