import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import BytesPage from "./page";
import FirebaseService, { ByteOverview } from "../utils/firebaseService";
import { mocked } from "jest-mock";
import { getDateString } from "../utils/timeUtils";
import "@testing-library/jest-dom";

jest.mock("../utils/firebaseService");

describe("Bytes page", () => {
  it("should display bytes", async () => {
    const mockListBytes = mocked(FirebaseService.prototype.listBytes);
    const mockByteOverviews: ByteOverview[] = [
      {
        title: "Title 1",
        subtitle: "Subtitle 1",
        thumbnail: "Thumbnail 1",
        publishDate: new Date(2024, 2, 5),
      },
      {
        title: "Title 2",
        subtitle: "Subtitle 2",
        thumbnail: "Thumbnail 2",
        publishDate: new Date(2024, 3, 6),
      },
    ];
    mockListBytes.mockReturnValue(
      new Promise<ByteOverview[]>((resolve) => {
        resolve(mockByteOverviews);
      })
    );

    render(<BytesPage />);

    await waitFor(() => {
      expect(mockListBytes).toHaveBeenCalledTimes(1);
    });

    // wait for byte overviews to be fetched and rendered
    let tilecards: HTMLElement[] = [];
    await waitFor(() => {
      mockByteOverviews.forEach((byteOverview) => {
        screen.findByTitle(byteOverview.title).then((tilecard: HTMLElement) => {
          expect(tilecard).toBeInTheDocument();
          tilecards.push(tilecard);
        });
      });
    });

    // test that each of the byte overviews are rendered
    for (let i = 0; i < tilecards.length; i++) {
      // test that the title was rendered
      expect(
        within(tilecards[i]).getByText(mockByteOverviews[i].title)
      ).toBeInTheDocument();

      // test that the subtitle was rendered
      expect(
        within(tilecards[i]).getByText(mockByteOverviews[i].subtitle)
      ).toBeInTheDocument();

      // test that the publish date was rendered
      expect(
        within(tilecards[i]).getByText(
          getDateString(mockByteOverviews[i].publishDate)
        )
      ).toBeInTheDocument();

      // test that the thumbnail was rendered
      expect(within(tilecards[i]).getByRole("img")).toHaveAttribute(
        "src",
        mockByteOverviews[i].thumbnail
      );
    }
  });
});
