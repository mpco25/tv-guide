import Link from "next/link";
import styles from "./GuideHeader.module.css";

type GuideHeaderProps = {
  title: string;
  meta: string;
  secondaryLink?: {
    href: string;
    label: string;
  };
};

export function GuideHeader({ title, meta, secondaryLink }: GuideHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.title}>{title}</div>
      <div className={styles.metaArea}>
        {secondaryLink ? (
          <Link className={styles.link} href={secondaryLink.href}>
            {secondaryLink.label}
          </Link>
        ) : null}
        <div className={styles.slice}>{meta}</div>
      </div>
    </header>
  );
}
