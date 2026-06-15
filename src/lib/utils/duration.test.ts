import { formatDurationSince } from "./duration";
import { describe, it, expect } from "vitest";

describe("formatDurationSince", () => {
  const baseTime = new Date("2026-06-14T12:00:00Z");

  it("should return 'now' for times less than 60 seconds ago", () => {
    const thirtySecondsAgo = new Date(baseTime.getTime() - 30 * 1000);
    expect(formatDurationSince(thirtySecondsAgo, baseTime)).toBe("now");
  });

  it("should return minutes ago", () => {
    const fiveMinutesAgo = new Date(baseTime.getTime() - 5 * 60 * 1000);
    expect(formatDurationSince(fiveMinutesAgo, baseTime)).toBe("5m ago");
  });

  it("should return hours ago", () => {
    const threeHoursAgo = new Date(baseTime.getTime() - 3 * 60 * 60 * 1000);
    expect(formatDurationSince(threeHoursAgo, baseTime)).toBe("3h ago");
  });

  it("should return days ago", () => {
    const twoDaysAgo = new Date(baseTime.getTime() - 2 * 24 * 60 * 60 * 1000);
    expect(formatDurationSince(twoDaysAgo, baseTime)).toBe("2d ago");
  });

  it("should return weeks ago", () => {
    const twoWeeksAgo = new Date(baseTime.getTime() - 2 * 7 * 24 * 60 * 60 * 1000);
    expect(formatDurationSince(twoWeeksAgo, baseTime)).toBe("2w ago");
  });

  it("should return months ago", () => {
    const twoMonthsAgo = new Date(baseTime.getTime() - 2 * 30 * 24 * 60 * 60 * 1000);
    expect(formatDurationSince(twoMonthsAgo, baseTime)).toBe("2mo ago");
  });

  it("should return years ago", () => {
    const oneYearAgo = new Date(baseTime.getTime() - 365 * 24 * 60 * 60 * 1000);
    expect(formatDurationSince(oneYearAgo, baseTime)).toBe("1y ago");
  });

  it("should accept ISO string timestamp", () => {
    const isoString = "2026-06-14T11:55:00Z";
    expect(formatDurationSince(isoString, baseTime)).toBe("5m ago");
  });

  it("should accept Date object", () => {
    const date = new Date("2026-06-14T11:55:00Z");
    expect(formatDurationSince(date, baseTime)).toBe("5m ago");
  });
});
