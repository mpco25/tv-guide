import { useState } from "react";
import type { GuideSegment } from "@/lib/types/guide";
import type { ProgramDetails } from "@/lib/types/programDetails";
import { ListingTooltip } from "./ListingTooltip";
import styles from "./ListingBar.module.css";

type ListingBarProps = {
  segments: GuideSegment[];
  detailsByProgramId: Record<string, ProgramDetails>;
  loadingProgramId: string | null;
  onSegmentHover: (programId: string) => void;
};

export function ListingBar({
  segments,
  detailsByProgramId,
  loadingProgramId,
  onSegmentHover
}: ListingBarProps) {
  const [activeProgramId, setActiveProgramId] = useState<string | null>(null);

  if (segments.length === 0) {
    return <div className={styles.empty}>No listings in this 2-hour slice</div>;
  }

  return (
    <div className={styles.track}>
      {segments.map((segment, index) => (
        <div
          key={segment.programId}
          className={`${styles.segment} ${index % 2 === 0 ? styles.primary : styles.secondary}`}
          style={{ width: `${segment.widthPercent}%` }}
          onMouseEnter={() => {
            setActiveProgramId(segment.programId);
            onSegmentHover(segment.programId);
          }}
          onMouseLeave={() => setActiveProgramId((current) =>
            current === segment.programId ? null : current
          )}
          onFocus={() => {
            setActiveProgramId(segment.programId);
            onSegmentHover(segment.programId);
          }}
          onBlur={() => setActiveProgramId((current) =>
            current === segment.programId ? null : current
          )}
          tabIndex={0}
        >
          <span className={styles.title}>{segment.title}</span>
          {activeProgramId === segment.programId ? (
            <ListingTooltip
              title={segment.title}
              visibleMinutes={segment.visibleMinutes}
              fullDurationMinutes={segment.fullDurationMinutes}
              details={detailsByProgramId[segment.programId]}
              loading={loadingProgramId === segment.programId}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
