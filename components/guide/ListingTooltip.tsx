import type { ProgramDetails } from "@/lib/types/programDetails";
import styles from "./ListingTooltip.module.css";

type ListingTooltipProps = {
  title: string;
  visibleMinutes: number;
  fullDurationMinutes: number;
  details?: ProgramDetails;
  loading: boolean;
};

export function ListingTooltip({
  title,
  visibleMinutes,
  fullDurationMinutes,
  details,
  loading
}: ListingTooltipProps) {
  return (
    <div className={styles.tooltip}>
      <div className={styles.heading}>{title}</div>
      <div className={styles.meta}>Visible in slice: {visibleMinutes} min</div>
      <div className={styles.meta}>Full duration: {fullDurationMinutes} min</div>
      {loading ? (
        <div className={styles.loading}>Loading extra info...</div>
      ) : details ? (
        <>
          <div className={styles.copy}>{details.synopsis}</div>
          <div className={styles.meta}>
            {details.genre} | {details.year}
          </div>
          <div className={styles.copy}>Cast: {details.cast.join(", ")}</div>
        </>
      ) : (
        <div className={styles.loading}>No extra info available.</div>
      )}
    </div>
  );
}
