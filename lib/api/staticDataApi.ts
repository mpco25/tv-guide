import type { TVGuideApi } from "@/lib/api/types";
import type { Channel } from "@/lib/types/channel";
import type { UserPreferences } from "@/lib/types/preferences";
import type { Program } from "@/lib/types/program";
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
    getSchedule: (sliceKey: string) => fetchJson<Program[]>(`/data/schedule/${sliceKey}.json`)
  };
}
