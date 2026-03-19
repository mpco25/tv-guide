import type { GuideRow } from "@/lib/types/guide";
import type { ProgramDetails } from "@/lib/types/programDetails";
import { GuideRowView } from "./GuideRow";
import styles from "./GuideTable.module.css";

type GuideTableProps = {
  rows: GuideRow[];
  detailsByProgramId: Record<string, ProgramDetails>;
  loadingProgramId: string | null;
  onSegmentHover: (programId: string) => void;
};

export function GuideTable({
  rows,
  detailsByProgramId,
  loadingProgramId,
  onSegmentHover
}: GuideTableProps) {
  return (
    <section className={styles.table}>
      <div className={styles.head}>
        <div>Channel</div>
        <div>Listings</div>
      </div>
      <div className={styles.body}>
        {rows.map((row) => (
          <GuideRowView
            key={row.channelId}
            row={row}
            detailsByProgramId={detailsByProgramId}
            loadingProgramId={loadingProgramId}
            onSegmentHover={onSegmentHover}
          />
        ))}
      </div>
    </section>
  );
}
