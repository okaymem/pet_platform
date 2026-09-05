import { describe, expect, it } from "vitest";
import { getNextScheduledAt } from "./reccurringEvents";

describe("getNextScheduledAt", () => {
  const date = new Date("2026-01-15T10:00:00.000Z");

  it("adds days", () => {
    const result = getNextScheduledAt(date, 3, "day");

    expect(result).toEqual(
      new Date("2026-01-18T10:00:00.000Z"),
    );
  });

  it("adds weeks", () => {
    const result = getNextScheduledAt(date, 2, "week");

    expect(result).toEqual(
      new Date("2026-01-29T10:00:00.000Z"),
    );
  });

  it("adds months", () => {
    const result = getNextScheduledAt(date, 2, "month");

    expect(result).toEqual(
      new Date("2026-03-15T10:00:00.000Z"),
    );
  });

  it("adds years", () => {
    const result = getNextScheduledAt(date, 2, "year");

    expect(result).toEqual(
      new Date("2028-01-15T10:00:00.000Z"),
    );
  });

  it("does not mutate the original date", () => {
    const original = new Date(
      "2026-01-15T10:00:00.000Z",
    );

    getNextScheduledAt(original, 3, "day");

    expect(original).toEqual(
      new Date("2026-01-15T10:00:00.000Z"),
    );
  });
});