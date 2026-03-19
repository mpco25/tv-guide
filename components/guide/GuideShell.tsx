"use client";

import { useEffect, useMemo, useState } from "react";
import { GuideHeader } from "@/components/guide/GuideHeader";
import { GuideFooter } from "@/components/guide/GuideFooter";
import { GuideTable } from "@/components/guide/GuideTable";
import { SliceNavigator } from "@/components/guide/SliceNavigator";
import { UserSwitcher } from "@/components/guide/UserSwitcher";
import { tvGuideApi } from "@/lib/api";
import { PROGRAM_DETAILS_FETCH_MODE } from "@/lib/config/app";
import { buildGuideRows } from "@/lib/guide/buildGuideRows";
import { shiftProgramsToGuideBase } from "@/lib/guide/mockSchedule";
import { getEffectivePreferences, readStoredUserId, writeStoredUserId } from "@/lib/preferences/storage";
import { formatSliceLabel, getAvailableSlices, getGuideBaseStart } from "@/lib/guide/slice";
import type { Channel } from "@/lib/types/channel";
import type { GuideRow } from "@/lib/types/guide";
import type { Program } from "@/lib/types/program";
import type { ProgramDetails } from "@/lib/types/programDetails";
import type { UserPreferences } from "@/lib/types/preferences";
import type { UserOption } from "@/lib/types/user";
import styles from "./GuideShell.module.css";

const DEFAULT_USER_ID = "user-1";

export function GuideShell() {
  const guideBaseStart = useMemo(() => getGuideBaseStart(), []);
  const availableSlices = useMemo(() => getAvailableSlices(guideBaseStart), [guideBaseStart]);
  const [sliceIndex, setSliceIndex] = useState(0);
  const [userId, setUserId] = useState(DEFAULT_USER_ID);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [detailsByProgramId, setDetailsByProgramId] = useState<Record<string, ProgramDetails>>({});
  const [loadingProgramId, setLoadingProgramId] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const currentSlice = availableSlices[sliceIndex];

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
        const [channelsData, usersData, preferencesData, scheduleTemplates, allDetails] =
          await Promise.all([
          tvGuideApi.getChannels(),
          tvGuideApi.getUsers(),
          tvGuideApi.getUserPreferences(userId),
          tvGuideApi.getScheduleTemplates(),
          PROGRAM_DETAILS_FETCH_MODE === "eager"
            ? tvGuideApi.getAllProgramDetails()
            : Promise.resolve({})
          ]);

        if (ignore) {
          return;
        }

        setChannels(channelsData);
        setUsers(usersData);
        setPreferences(getEffectivePreferences(preferencesData));
        setPrograms(shiftProgramsToGuideBase(scheduleTemplates, availableSlices[0].start));
        setDetailsByProgramId(allDetails);
        setStatus("ready");
      } catch (error) {
        console.error("Failed to load guide data", error);
        if (!ignore) {
          setStatus("error");
        }
      }
    }

    void loadData();

    return () => {
      ignore = true;
    };
  }, [availableSlices, userId]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName ?? "";
      if (tagName === "INPUT" || tagName === "SELECT" || tagName === "TEXTAREA") {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setSliceIndex((value) => Math.max(value - 1, 0));
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setSliceIndex((value) => Math.min(value + 1, availableSlices.length - 1));
      }

      if (event.key === "1") {
        const firstUser = users[0];
        if (firstUser) {
          event.preventDefault();
          setUserId(firstUser.id);
          writeStoredUserId(firstUser.id);
        }
      }

      if (event.key === "2") {
        const secondUser = users[1];
        if (secondUser) {
          event.preventDefault();
          setUserId(secondUser.id);
          writeStoredUserId(secondUser.id);
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [availableSlices.length, users]);

  const rows: GuideRow[] = useMemo(() => {
    if (!preferences) {
      return [];
    }

    return buildGuideRows({
      channels,
      preferences,
      programs,
      sliceStart: currentSlice.start,
      sliceEnd: currentSlice.end
    });
  }, [channels, currentSlice.end, currentSlice.start, preferences, programs]);

  async function handleSegmentHover(programId: string) {
    if (detailsByProgramId[programId] || PROGRAM_DETAILS_FETCH_MODE === "eager") {
      return;
    }

    try {
      setLoadingProgramId(programId);
      const details = await tvGuideApi.getProgramDetails(programId);
      setDetailsByProgramId((current) => ({
        ...current,
        [programId]: details
      }));
    } catch (error) {
      console.error("Failed to load program details", error);
    } finally {
      setLoadingProgramId((current) => (current === programId ? null : current));
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <GuideHeader
          title="TV GUIDE"
          meta={formatSliceLabel(currentSlice)}
          secondaryLink={{ href: "/preferences", label: "Preferences" }}
        />
        <UserSwitcher
          selectedUserId={userId}
          users={users}
          onChange={(nextUserId) => {
            setUserId(nextUserId);
            writeStoredUserId(nextUserId);
          }}
        />
        <SliceNavigator
          canGoPrev={sliceIndex > 0}
          canGoNext={sliceIndex < availableSlices.length - 1}
          onPrev={() => setSliceIndex((value) => Math.max(value - 1, 0))}
          onNext={() =>
            setSliceIndex((value) => Math.min(value + 1, availableSlices.length - 1))
          }
        />
        {status === "error" ? (
          <div className={styles.message}>Unable to load guide data.</div>
        ) : status === "loading" ? (
          <div className={styles.message}>Loading 2-hour slice...</div>
        ) : (
          <GuideTable
            rows={rows}
            detailsByProgramId={detailsByProgramId}
            loadingProgramId={loadingProgramId}
            onSegmentHover={handleSegmentHover}
          />
        )}
        <GuideFooter />
      </div>
    </main>
  );
}
