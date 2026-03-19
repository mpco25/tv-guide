import { describe, expect, it } from "vitest";
import { clipProgramToSlice, getVisibleDurationMinutes } from "@/lib/guide/overlap";
import { getWidthPercent } from "@/lib/guide/widths";
import type { Program } from "@/lib/types/program";

const SLICE_START = "2026-03-19T20:00:00Z";
const SLICE_END = "2026-03-19T22:00:00Z";

describe("overlap helpers", () => {
  it("clips a program that starts before the slice", () => {
    const program: Program = {
      id: "pre-roll",
      channelId: "bbc",
      title: "Carry-over",
      start: "2026-03-19T19:30:00Z",
      end: "2026-03-19T20:30:00Z"
    };

    const clipped = clipProgramToSlice(program, SLICE_START, SLICE_END);

    expect(clipped).toEqual({
      visibleStart: "2026-03-19T20:00:00.000Z",
      visibleEnd: "2026-03-19T20:30:00.000Z"
    });
    expect(getVisibleDurationMinutes(clipped!.visibleStart, clipped!.visibleEnd)).toBe(30);
  });

  it("returns null when a program does not overlap the slice", () => {
    const program: Program = {
      id: "outside",
      channelId: "bbc",
      title: "Outside",
      start: "2026-03-19T18:00:00Z",
      end: "2026-03-19T19:00:00Z"
    };

    expect(clipProgramToSlice(program, SLICE_START, SLICE_END)).toBeNull();
  });

  it("computes width percentage from visible duration", () => {
    expect(getWidthPercent(90, 120)).toBe(75);
    expect(getWidthPercent(30, 120)).toBe(25);
    expect(getWidthPercent(0, 120)).toBe(0);
  });
});
