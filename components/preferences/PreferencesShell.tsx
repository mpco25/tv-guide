"use client";

import { useEffect, useMemo, useState } from "react";
import { GuideHeader } from "@/components/guide/GuideHeader";
import { tvGuideApi } from "@/lib/api";
import {
  getEffectivePreferences,
  readStoredUserId,
  writePreferenceOverride,
  writeStoredUserId
} from "@/lib/preferences/storage";
import type { Channel } from "@/lib/types/channel";
import type { UserPreferences } from "@/lib/types/preferences";
import type { UserOption } from "@/lib/types/user";
import styles from "./PreferencesShell.module.css";

type TabId = "channels" | "guide" | "viewer";

const DEFAULT_USER_ID = "user-1";
const TABS: Array<{ id: TabId; label: string }> = [
  { id: "channels", label: "Channels" },
  { id: "guide", label: "Guide" },
  { id: "viewer", label: "Viewer" }
];

export function PreferencesShell() {
  const [activeTab, setActiveTab] = useState<TabId>("channels");
  const [userId, setUserId] = useState(DEFAULT_USER_ID);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const storedUserId = readStoredUserId();
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        setStatus("loading");
        const [channelsData, usersData, preferencesData] = await Promise.all([
          tvGuideApi.getChannels(),
          tvGuideApi.getUsers(),
          tvGuideApi.getUserPreferences(userId)
        ]);

        if (ignore) {
          return;
        }

        setChannels(channelsData.sort((left, right) => left.name.localeCompare(right.name)));
        setUsers(usersData);
        setPreferences(getEffectivePreferences(preferencesData));
        setStatus("ready");
      } catch (error) {
        console.error("Failed to load preferences", error);
        if (!ignore) {
          setStatus("error");
        }
      }
    }

    void loadData();

    return () => {
      ignore = true;
    };
  }, [userId]);

  const hiddenSet = useMemo(
    () => new Set(preferences?.hidden ?? []),
    [preferences?.hidden]
  );

  function updatePreferences(nextPreferences: UserPreferences) {
    setPreferences(nextPreferences);
    writePreferenceOverride(nextPreferences.userId, {
      favorites: nextPreferences.favorites,
      hidden: nextPreferences.hidden,
      showEmptyChannels: nextPreferences.showEmptyChannels
    });
  }

  function toggleShown(channelId: string) {
    if (!preferences) {
      return;
    }

    const nextHidden = hiddenSet.has(channelId)
      ? preferences.hidden.filter((id) => id !== channelId)
      : [...preferences.hidden, channelId];

    updatePreferences({
      ...preferences,
      hidden: nextHidden
    });
  }

  function renderTabBody() {
    if (!preferences) {
      return null;
    }

    if (activeTab === "channels") {
      return (
        <div className={styles.panelBody}>
          <p className={styles.copy}>
            Choose which channels are shown in the guide for the selected viewer.
          </p>
          <div className={styles.channelList}>
            {channels.map((channel) => (
              <div key={channel.id} className={styles.channelRow}>
                <div className={styles.channelName}>{channel.name}</div>
                <label className={styles.control}>
                  <input
                    checked={!hiddenSet.has(channel.id)}
                    onChange={() => toggleShown(channel.id)}
                    type="checkbox"
                    aria-label={`Show ${channel.name}`}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === "guide") {
      return (
        <div className={styles.panelBody}>
          <p className={styles.copy}>
            These settings affect how the guide is rendered for the selected viewer.
          </p>
          <label className={styles.stackedControl}>
            <input
              checked={preferences.showEmptyChannels}
              onChange={() =>
                updatePreferences({
                  ...preferences,
                  showEmptyChannels: !preferences.showEmptyChannels
                })
              }
              type="checkbox"
            />
            Show channels even when there are no listings in the current 2-hour slice
          </label>
        </div>
      );
    }

    return (
      <div className={styles.panelBody}>
        <p className={styles.copy}>
          Choose which mock viewer is active. The selected viewer is shared with the guide page.
        </p>
        <div className={styles.viewerList}>
          {users.map((user) => (
            <button
              key={user.id}
              className={`${styles.viewerButton} ${user.id === userId ? styles.viewerButtonActive : ""}`}
              onClick={() => {
                setUserId(user.id);
                writeStoredUserId(user.id);
              }}
              type="button"
            >
              {user.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <GuideHeader
          title="PREFERENCES"
          meta="Teletext profile settings"
          secondaryLink={{ href: "/", label: "Back To Guide" }}
        />
        {status === "error" ? (
          <div className={styles.message}>Unable to load preferences.</div>
        ) : status === "loading" ? (
          <div className={styles.message}>Loading preferences...</div>
        ) : (
          <div className={styles.content}>
            <div className={styles.notice}>
              Your preferences are stored in local storage (saved in this browser on this device, so
              they stay after refresh, are not sent to any servers, and do not automatically follow
              you to another browser or computer).
            </div>
            <div className={styles.tabs} role="tablist" aria-label="Preferences sections">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <section className={styles.panel}>{renderTabBody()}</section>
          </div>
        )}
      </div>
    </main>
  );
}
