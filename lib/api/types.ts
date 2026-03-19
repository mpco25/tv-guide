import type { Channel } from "@/lib/types/channel";
import type { UserPreferences } from "@/lib/types/preferences";
import type { Program } from "@/lib/types/program";
import type { ProgramDetails } from "@/lib/types/programDetails";
import type { UserOption } from "@/lib/types/user";

export type TVGuideApi = {
  getChannels: () => Promise<Channel[]>;
  getUsers: () => Promise<UserOption[]>;
  getUserPreferences: (userId: string) => Promise<UserPreferences>;
  getScheduleTemplates: () => Promise<Program[]>;
  getProgramDetails: (programId: string) => Promise<ProgramDetails>;
  getAllProgramDetails: () => Promise<Record<string, ProgramDetails>>;
};
