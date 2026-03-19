export type SliceDefinition = {
  key: string;
  start: string;
  end: string;
};

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export function getGuideBaseStart(now: Date = new Date()) {
  const base = new Date(now);
  base.setSeconds(0, 0);

  return base;
}

export function getAvailableSlices(baseStart: Date) {
  return Array.from({ length: 3 }, (_, index) => {
    const sliceStart = new Date(baseStart.getTime() + index * TWO_HOURS_MS);
    const sliceEnd = new Date(sliceStart.getTime() + TWO_HOURS_MS);

    return {
      key: sliceStart.toISOString(),
      start: sliceStart.toISOString(),
      end: sliceEnd.toISOString()
    };
  });
}

export function formatSliceLabel(slice: SliceDefinition) {
  const start = new Date(slice.start);
  const end = new Date(slice.end);

  const datePart = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short"
  }).format(start);

  const startPart = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(start);

  const endPart = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(end);

  return `${datePart.toUpperCase()} ${startPart}-${endPart}`;
}
