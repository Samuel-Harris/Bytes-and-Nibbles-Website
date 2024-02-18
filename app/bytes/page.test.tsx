import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import BytesPage from "./page";
import FirebaseService from "../utils/firebaseService";
import { mocked, MockedFunction } from "jest-mock";
import { getDateString } from "../utils/timeUtils";
import "@testing-library/jest-dom";
import { ByteOverview } from "../utils/Byte";

jest.mock("../utils/firebaseService");

let mockFirebaseGetInstance: MockedFunction<() => FirebaseService>;
let mockListBytes: MockedFunction<() => Promise<ByteOverview[]>>;
let mockByteOverviews: ByteOverview[];

describe("Bytes page", () => {
  beforeAll(() => {
    // set up firebaseService mock
    mockFirebaseGetInstance = mocked(FirebaseService.getInstance);
    mockListBytes = mocked(FirebaseService.prototype.listBytes);
    mockByteOverviews = [
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

    mockFirebaseGetInstance.mockReturnValue(FirebaseService.prototype);
    mockListBytes.mockReturnValue(
      new Promise<ByteOverview[]>((resolve) => {
        resolve(mockByteOverviews);
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call firebaseService.listBytes()", async () => {
    render(<BytesPage />);

    await waitFor(() => {
      expect(mockListBytes).toHaveBeenCalledTimes(1);
    });
  });

  it("should should render all of the information for each tilecard", async () => {
    render(<BytesPage />);

    await waitFor(() => {
      mockByteOverviews.forEach((byteOverview) => {
        screen.findByTitle(byteOverview.title).then((tilecard: HTMLElement) => {
          // test that the title was rendered
          expect(
            within(tilecard).getByText(byteOverview.title)
          ).toBeInTheDocument();

          // test that the subtitle was rendered
          expect(
            within(tilecard).getByText(byteOverview.subtitle)
          ).toBeInTheDocument();

          // test that the publish date was rendered
          expect(
            within(tilecard).getByText(getDateString(byteOverview.publishDate))
          ).toBeInTheDocument();

          // test that the thumbnail was rendered
          expect(within(tilecard).getByRole("img")).toHaveAttribute(
            "src",
            byteOverview.thumbnail
          );

          // test that the link to the byte was rendered
          expect(within(tilecard).getByRole("link")).toHaveAttribute(
            "href",
            `/bytes/${byteOverview.slug}`
          );
        });
      });
    });
  });
});
