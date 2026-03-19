import { clipProgramToSlice, getVisibleDurationMinutes } from "@/lib/guide/overlap";
import { getWidthPercent } from "@/lib/guide/widths";
import type { Channel } from "@/lib/types/channel";
import type { GuideRow } from "@/lib/types/guide";
import type { UserPreferences } from "@/lib/types/preferences";
import type { Program } from "@/lib/types/program";

type BuildGuideRowsArgs = {
  channels: Channel[];
  preferences: UserPreferences;
  programs: Program[];
  sliceStart: string;
  sliceEnd: string;
};

export function buildGuideRows({
  channels,
  preferences,
  programs,
  sliceStart,
  sliceEnd
}: BuildGuideRowsArgs): GuideRow[] {
  const hidden = new Set(preferences.hidden);
  const favorites = new Set(preferences.favorites);
  const sliceMinutes = 120;

  const visibleChannels = channels
    .filter((channel) => !hidden.has(channel.id))
    .sort((left, right) => {
      const favoriteDelta = Number(favorites.has(right.id)) - Number(favorites.has(left.id));
      if (favoriteDelta !== 0) {
        return favoriteDelta;
      }

      return left.name.localeCompare(right.name);
    });

  return visibleChannels.map((channel) => {
    const segments = programs
      .filter((program) => program.channelId === channel.id)
      .map((program) => {
        const clipped = clipProgramToSlice(program, sliceStart, sliceEnd);
        return {
          program,
          clipped,
          visibleMinutes: clipped
            ? getVisibleDurationMinutes(clipped.visibleStart, clipped.visibleEnd)
            : 0
        };
      })
      .filter((entry) => entry.clipped && entry.visibleMinutes > 0)
      .sort((left, right) => left.program.start.localeCompare(right.program.start))
      .map((entry) => ({
        programId: entry.program.id,
        title: entry.program.title,
        visibleMinutes: entry.visibleMinutes,
        widthPercent: getWidthPercent(entry.visibleMinutes, sliceMinutes)
      }));

    return {
      channelId: channel.id,
      channelName: channel.name,
      segments
    };
  });
}
