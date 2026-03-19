import { describe, expect, it } from "vitest";
import { buildGuideRows } from "@/lib/guide/buildGuideRows";
import type { Channel } from "@/lib/types/channel";
import type { UserPreferences } from "@/lib/types/preferences";
import type { Program } from "@/lib/types/program";

const channels: Channel[] = [
  { id: "abc", name: "ABC" },
  { id: "bbc", name: "BBC" },
  { id: "nbc", name: "NBC" }
];

const preferences: UserPreferences = {
  userId: "user-1",
  favorites: ["bbc"],
  hidden: ["abc"],
  showEmptyChannels: true
};

const programs: Program[] = [
  {
    id: "bbc-1",
    channelId: "bbc",
    title: "Sherlock",
    start: "2026-03-19T20:00:00Z",
    end: "2026-03-19T21:30:00Z"
  },
  {
    id: "bbc-2",
    channelId: "bbc",
    title: "Newsnight",
    start: "2026-03-19T21:30:00Z",
    end: "2026-03-19T22:00:00Z"
  },
  {
    id: "nbc-1",
    channelId: "nbc",
    title: "Dateline NBC",
    start: "2026-03-19T20:00:00Z",
    end: "2026-03-19T21:00:00Z"
  },
  {
    id: "nbc-2",
    channelId: "nbc",
    title: "Chicago P.D.",
    start: "2026-03-19T21:00:00Z",
    end: "2026-03-19T22:00:00Z"
  }
];

describe("buildGuideRows", () => {
  it("keeps one row per visible channel and calculates proportional widths", () => {
    const rows = buildGuideRows({
      channels,
      preferences,
      programs,
      sliceStart: "2026-03-19T20:00:00Z",
      sliceEnd: "2026-03-19T22:00:00Z"
    });

    expect(rows).toHaveLength(2);
    expect(rows.map((row) => row.channelName)).toEqual(["BBC", "NBC"]);
    expect(rows[0].segments).toEqual([
      {
        programId: "bbc-1",
        title: "Sherlock",
        visibleMinutes: 90,
        widthPercent: 75,
        fullDurationMinutes: 90
      },
      {
        programId: "bbc-2",
        title: "Newsnight",
        visibleMinutes: 30,
        widthPercent: 25,
        fullDurationMinutes: 30
      }
    ]);
    expect(rows[1].segments).toEqual([
      {
        programId: "nbc-1",
        title: "Dateline NBC",
        visibleMinutes: 60,
        widthPercent: 50,
        fullDurationMinutes: 60
      },
      {
        programId: "nbc-2",
        title: "Chicago P.D.",
        visibleMinutes: 60,
        widthPercent: 50,
        fullDurationMinutes: 60
      }
    ]);
  });
});
