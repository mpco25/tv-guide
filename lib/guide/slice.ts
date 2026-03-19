export type SliceDefinition = {
  key: string;
  start: string;
  end: string;
};

const SLICES: SliceDefinition[] = [
  {
    key: "2026-03-19T18-00_20-00",
    start: "2026-03-19T18:00:00Z",
    end: "2026-03-19T20:00:00Z"
  },
  {
    key: "2026-03-19T20-00_22-00",
    start: "2026-03-19T20:00:00Z",
    end: "2026-03-19T22:00:00Z"
  },
  {
    key: "2026-03-19T22-00_00-00",
    start: "2026-03-19T22:00:00Z",
    end: "2026-03-20T00:00:00Z"
  }
];

export function getAvailableSlices() {
  return SLICES;
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
    hour12: false,
    timeZone: "UTC"
  }).format(start);

  const endPart = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC"
  }).format(end);

  return `${datePart.toUpperCase()} ${startPart}-${endPart}`;
}
