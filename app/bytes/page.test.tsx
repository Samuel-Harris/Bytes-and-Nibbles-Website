import React, { FC } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import BytesPage from "./page";
import FirebaseService from "@/utils/firebaseService";
import { mocked, MockedFunction } from "jest-mock";
import "@testing-library/jest-dom";
import { ByteOverview } from "@/utils/Byte";
import Tilecard, { TilecardProps } from "@/components/tilecard";

jest.mock("@/utils/firebaseService");
jest.mock("@/components/tilecard");

let firebaseGetInstanceMock: MockedFunction<() => Promise<FirebaseService>>;
let listBytesMock: MockedFunction<() => ByteOverview[]>;
let byteOverviewsMock: ByteOverview[];
let tilecardMock: MockedFunction<FC<TilecardProps>>;
let mockTextPrefix: string;

describe("Bytes page", () => {
  beforeAll(() => {
    // set up firebaseService mock
    firebaseGetInstanceMock = mocked(FirebaseService.getInstance);
    listBytesMock = mocked(FirebaseService.prototype.listBytes);
    byteOverviewsMock = [
      {
        title: "Title 1",
        subtitle: "Subtitle 1",
        thumbnail: "Thumbnail 1",
        publishDate: new Date(2024, 2, 5),
        slug: "slug-1",
      },
      {
        title: "Title 2",
        subtitle: "Subtitle 2",
        thumbnail: "Thumbnail 2",
        publishDate: new Date(2024, 3, 6),
        slug: "slug-2",
      },
    ];

    firebaseGetInstanceMock.mockReturnValue(Promise.resolve(FirebaseService.prototype));
    listBytesMock.mockReturnValue(byteOverviewsMock);

    mockTextPrefix = "mock_";
    tilecardMock = mocked(Tilecard);
    tilecardMock.mockImplementation((props: TilecardProps) => {
      return <p>{mockTextPrefix}{props.title}</p>;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call firebaseService.listBytes()", async () => {
    render(<BytesPage />);

    await waitFor(() => {
      expect(listBytesMock).toHaveBeenCalledTimes(1);
    });
  });

  it("should should render all of the tilecards", async () => {
    render(<BytesPage />);

    await waitFor(() => {  // test breaks if waitFor is not used here
      expect(tilecardMock).toHaveBeenCalledTimes(byteOverviewsMock.length);
    });
    byteOverviewsMock.forEach((byteOverview) => {
      expect(screen.getByText(mockTextPrefix + byteOverview.title)).toBeInTheDocument();
    });
  });
});
