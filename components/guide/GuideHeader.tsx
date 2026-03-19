import styles from "./GuideHeader.module.css";

type GuideHeaderProps = {
  title: string;
  sliceLabel: string;
};

export function GuideHeader({ title, sliceLabel }: GuideHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.pageMarker}>100</div>
      <div className={styles.title}>{title}</div>
      <div className={styles.slice}>{sliceLabel}</div>
    </header>
  );
}
