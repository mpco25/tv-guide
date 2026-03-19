import type { Program } from "@/lib/types/program";

type ClippedProgram = {
  visibleStart: string;
  visibleEnd: string;
};

export function clipProgramToSlice(
  program: Program,
  sliceStart: string,
  sliceEnd: string
): ClippedProgram | null {
  const programStart = new Date(program.start).getTime();
  const programEnd = new Date(program.end).getTime();
  const rangeStart = new Date(sliceStart).getTime();
  const rangeEnd = new Date(sliceEnd).getTime();

  if (programStart >= rangeEnd || programEnd <= rangeStart) {
    return null;
  }

  return {
    visibleStart: new Date(Math.max(programStart, rangeStart)).toISOString(),
    visibleEnd: new Date(Math.min(programEnd, rangeEnd)).toISOString()
  };
}

export function getVisibleDurationMinutes(visibleStart: string, visibleEnd: string) {
  const start = new Date(visibleStart).getTime();
  const end = new Date(visibleEnd).getTime();

  return Math.max(0, Math.round((end - start) / 60000));
}
