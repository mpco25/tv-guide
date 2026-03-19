import styles from "./SliceNavigator.module.css";

type SliceNavigatorProps = {
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export function SliceNavigator({
  canGoPrev,
  canGoNext,
  onPrev,
  onNext
}: SliceNavigatorProps) {
  return (
    <div className={styles.nav}>
      <button className={styles.button} disabled={!canGoPrev} onClick={onPrev} type="button">
        {"<- Prev"}
      </button>
      <div className={styles.label}>2-hour window</div>
      <button className={styles.button} disabled={!canGoNext} onClick={onNext} type="button">
        {"Next ->"}
      </button>
    </div>
  );
}
