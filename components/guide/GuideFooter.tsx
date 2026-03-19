import styles from "./GuideFooter.module.css";

export function GuideFooter() {
  return (
    <footer className={styles.footer}>
      <span>Keys:</span>
      <span>Left/Right = change 2-hour slice</span>
      <span>1/2 = switch viewer</span>
    </footer>
  );
}
