import type { GuideRow } from "@/lib/types/guide";
import type { ProgramDetails } from "@/lib/types/programDetails";
import { ListingBar } from "./ListingBar";
import styles from "./GuideRow.module.css";

type GuideRowProps = {
  row: GuideRow;
  detailsByProgramId: Record<string, ProgramDetails>;
  loadingProgramId: string | null;
  onSegmentHover: (programId: string) => void;
};

export function GuideRowView({
  row,
  detailsByProgramId,
  loadingProgramId,
  onSegmentHover
}: GuideRowProps) {
  return (
    <article className={styles.row}>
      <div className={styles.channel}>{row.channelName}</div>
      <ListingBar
        segments={row.segments}
        detailsByProgramId={detailsByProgramId}
        loadingProgramId={loadingProgramId}
        onSegmentHover={onSegmentHover}
      />
    </article>
  );
}
