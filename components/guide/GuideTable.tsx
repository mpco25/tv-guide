import type { GuideRow } from "@/lib/types/guide";
import { GuideRowView } from "./GuideRow";
import styles from "./GuideTable.module.css";

type GuideTableProps = {
  rows: GuideRow[];
};

export function GuideTable({ rows }: GuideTableProps) {
  return (
    <section className={styles.table}>
      <div className={styles.head}>
        <div>Channel</div>
        <div>Listings</div>
      </div>
      <div className={styles.body}>
        {rows.map((row) => (
          <GuideRowView key={row.channelId} row={row} />
        ))}
      </div>
    </section>
  );
}
