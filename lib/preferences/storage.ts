import type { UserPreferences } from "@/lib/types/preferences";

const USER_ID_KEY = "tv-guide-user-id";
const PREFS_PREFIX = "tv-guide-user-prefs:";

type PreferenceOverride = Partial<Omit<UserPreferences, "userId">>;

export function readStoredUserId() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(USER_ID_KEY);
}

export function writeStoredUserId(userId: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(USER_ID_KEY, userId);
}

function getPreferenceKey(userId: string) {
  return `${PREFS_PREFIX}${userId}`;
}

export function readPreferenceOverride(userId: string): PreferenceOverride {
  if (typeof window === "undefined") {
    return {};
  }

  const rawValue = window.localStorage.getItem(getPreferenceKey(userId));
  if (!rawValue) {
    return {};
  }

  try {
    return JSON.parse(rawValue) as PreferenceOverride;
  } catch {
    return {};
  }
}

export function writePreferenceOverride(userId: string, value: PreferenceOverride) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getPreferenceKey(userId), JSON.stringify(value));
}

export function getEffectivePreferences(base: UserPreferences): UserPreferences {
  const override = readPreferenceOverride(base.userId);

  return {
    ...base,
    ...override,
    favorites: override.favorites ?? base.favorites,
    hidden: override.hidden ?? base.hidden,
    showEmptyChannels: override.showEmptyChannels ?? base.showEmptyChannels
  };
}
