import type { TVGuideApi } from "@/lib/api/types";
import type { Channel } from "@/lib/types/channel";
import type { UserPreferences } from "@/lib/types/preferences";
import type { Program } from "@/lib/types/program";
import type { ProgramDetails } from "@/lib/types/programDetails";
import type { UserOption } from "@/lib/types/user";

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Request failed: ${path}`);
  }

  return (await response.json()) as T;
}

export function createStaticDataApi(): TVGuideApi {
  return {
    getChannels: () => fetchJson<Channel[]>("/data/channels.json"),
    getUsers: () => fetchJson<UserOption[]>("/data/users/index.json"),
    getUserPreferences: (userId: string) =>
      fetchJson<UserPreferences>(`/data/users/${userId}.json`),
    getScheduleTemplates: async () => {
      const schedules = await Promise.all([
        fetchJson<Program[]>("/data/schedule/2026-03-19T18-00_20-00.json"),
        fetchJson<Program[]>("/data/schedule/2026-03-19T20-00_22-00.json"),
        fetchJson<Program[]>("/data/schedule/2026-03-19T22-00_00-00.json")
      ]);

      return schedules.flat();
    },
    getProgramDetails: async (programId: string) => {
      const details = await fetchJson<Record<string, ProgramDetails>>("/data/program-details.json");

      const programDetails = details[programId];
      if (!programDetails) {
        throw new Error(`Missing program details for ${programId}`);
      }

      await new Promise((resolve) => {
        window.setTimeout(resolve, 150);
      });

      return programDetails;
    },
    getAllProgramDetails: () =>
      fetchJson<Record<string, ProgramDetails>>("/data/program-details.json")
  };
}
