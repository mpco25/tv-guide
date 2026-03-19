import type { GuideRow } from "@/lib/types/guide";
import { ListingBar } from "./ListingBar";
import styles from "./GuideRow.module.css";

type GuideRowProps = {
  row: GuideRow;
};

export function GuideRowView({ row }: GuideRowProps) {
  return (
    <article className={styles.row}>
      <div className={styles.channel}>{row.channelName}</div>
      <ListingBar segments={row.segments} />
    </article>
  );
}
