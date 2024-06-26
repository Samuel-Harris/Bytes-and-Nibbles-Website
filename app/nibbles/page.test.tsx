import React, { FC } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import FirebaseService from "@/common/FirebaseService";
import { mocked, MockedFunction } from "jest-mock";
import "@testing-library/jest-dom";
import Tilecard, { TilecardProps } from "@/tilecard/Tilecard";
import { NibbleOverview } from "@/common/Nibble";
import TilecardSubheading, {
  TilecardSubheadingProps,
} from "./TilecardSubheading";
import NibblesPage from "./page";

jest.mock("@/common/FirebaseService");
jest.mock("@/tilecard/Tilecard");
jest.mock("./TilecardSubheading");

let firebaseGetInstanceMock: MockedFunction<() => Promise<FirebaseService>>;
let listNibblesMock: MockedFunction<() => NibbleOverview[]>;
let nibbleOverviewsMock: NibbleOverview[];
let tilecardSubheadingMock: MockedFunction<FC<TilecardSubheadingProps>>;
let tilecardMock: MockedFunction<FC<TilecardProps>>;

describe("Bytes page", () => {
  beforeAll(() => {
    jest.clearAllMocks();
    firebaseGetInstanceMock = mocked(FirebaseService.getInstance);
    firebaseGetInstanceMock.mockReturnValue(
      Promise.resolve(FirebaseService.prototype)
    );

    nibbleOverviewsMock = [
      {
        title: "My nibble 1",
        thumbnail: "My thumbnail 3",
        coverPhoto: "My cover photo 3",
        slug: "my-slug-3",
        publishDate: new Date("11/05/24"),
        timeTakenMinutes: 60,
      },
      {
        title: "My nibble 2",
        thumbnail: "My thumbnail 4",
        coverPhoto: "My cover photo 4",
        slug: "my-slug-4",
        publishDate: new Date("12/03/21"),
        timeTakenMinutes: 65,
      },
    ];

    listNibblesMock = mocked(FirebaseService.prototype.listNibbles);
    listNibblesMock.mockReturnValue(nibbleOverviewsMock);

    tilecardMock = mocked(Tilecard);
    tilecardMock.mockImplementation(({ title, children }: TilecardProps) => {
      return (
        <div>
          <p>{title}</p>
          {children}
        </div>
      );
    });

    tilecardSubheadingMock = mocked(TilecardSubheading);
    tilecardSubheadingMock.mockImplementation(
      ({ timeTakenMinutes }: TilecardSubheadingProps) => {
        return <p>{timeTakenMinutes}</p>;
      }
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should should render all of the tilecards", async () => {
    render(await NibblesPage());

    await waitFor((): void => {
      expect(listNibblesMock).toHaveBeenCalledTimes(1);
    });

    nibbleOverviewsMock.forEach((nibbleOverview: NibbleOverview): void => {
      expect(screen.getByText(nibbleOverview.title)).toBeInTheDocument();
      expect(
        screen.getByText(nibbleOverview.timeTakenMinutes)
      ).toBeInTheDocument();
    });
  });
});
