const DEFAULT_SLICE_MINUTES = 120;

export function getWidthPercent(
  visibleMinutes: number,
  sliceMinutes: number = DEFAULT_SLICE_MINUTES
) {
  if (sliceMinutes <= 0 || visibleMinutes <= 0) {
    return 0;
  }

  return (visibleMinutes / sliceMinutes) * 100;
}
