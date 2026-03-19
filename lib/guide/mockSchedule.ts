import type { Program } from "@/lib/types/program";

const TEMPLATE_BASE_START = "2026-03-19T18:00:00Z";

function shiftIsoDate(isoDate: string, offsetMs: number) {
  return new Date(new Date(isoDate).getTime() + offsetMs).toISOString();
}

export function shiftProgramsToGuideBase(programs: Program[], guideBaseStart: string) {
  const offsetMs =
    new Date(guideBaseStart).getTime() - new Date(TEMPLATE_BASE_START).getTime();

  return programs.map((program) => ({
    ...program,
    start: shiftIsoDate(program.start, offsetMs),
    end: shiftIsoDate(program.end, offsetMs)
  }));
}
