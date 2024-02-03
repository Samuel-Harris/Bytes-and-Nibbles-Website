import { getDate } from "./timeUtils";

describe("timeUtils", () => {
  it("should convert Date objects into date strings", () => {
    const date = new Date(2024, 6, 25);

    const dateString = getDate(date);

    expect(dateString).toBe("Thu, 25 Jul 2024");
  });
});
