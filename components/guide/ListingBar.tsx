import type { GuideSegment } from "@/lib/types/guide";
import styles from "./ListingBar.module.css";

type ListingBarProps = {
  segments: GuideSegment[];
};

export function ListingBar({ segments }: ListingBarProps) {
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
          title={`${segment.title} (${segment.visibleMinutes} min)`}
        >
          <span className={styles.title}>{segment.title}</span>
        </div>
      ))}
    </div>
  );
}
