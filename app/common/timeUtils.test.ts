import { getDateString } from "./timeUtils";

describe("timeUtils", () => {
  it("should convert objects into date strings for all months", () => {
    const dates = {
      "Mon, 15 Jan 2029": new Date(2029, 0, 15),
      "Thu, 15 Feb 2029": new Date(2029, 1, 15),
      "Thu, 15 Mar 2029": new Date(2029, 2, 15),
      "Sun, 15 Apr 2029": new Date(2029, 3, 15),
      "Tue, 15 May 2029": new Date(2029, 4, 15),
      "Fri, 15 Jun 2029": new Date(2029, 5, 15),
      "Sun, 15 Jul 2029": new Date(2029, 6, 15),
      "Wed, 15 Aug 2029": new Date(2029, 7, 15),
      "Sat, 15 Sep 2029": new Date(2029, 8, 15),
      "Mon, 15 Oct 2029": new Date(2029, 9, 15),
      "Thu, 15 Nov 2029": new Date(2029, 10, 15),
      "Sat, 15 Dec 2029": new Date(2029, 11, 15),
    };

    Object.entries(dates).forEach(([dateString, date]) => {
      expect(getDateString(date)).toBe(dateString);
    });
  });
});
