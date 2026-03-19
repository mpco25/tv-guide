export type GuideSegment = {
  programId: string;
  title: string;
  visibleMinutes: number;
  widthPercent: number;
};

export type GuideRow = {
  channelId: string;
  channelName: string;
  segments: GuideSegment[];
};
