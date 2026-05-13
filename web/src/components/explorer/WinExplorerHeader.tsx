"use client";

import styles from "./winExplorerHeader.module.scss";

type Props = {
  title: string;
  leading?: React.ReactNode;
  maximized: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
};

export function WinExplorerHeader({
  title,
  leading,
  maximized,
  onMinimize,
  onMaximize,
  onClose,
}: Props) {
  return (
    <header className={styles.root} onMouseDown={(e) => e.stopPropagation()}>
      {leading ? <div className={styles.leading}>{leading}</div> : null}
      <span className={styles.title}>{title}</span>
      <div className={styles.controls}>
        <button type="button" className={styles.controlBtn} aria-label="최소화" onClick={onMinimize}>
          <span className={styles.iconMin} />
        </button>
        <button type="button" className={styles.controlBtn} aria-label={maximized ? "이전 크기로" : "최대화"} onClick={onMaximize}>
          {maximized ? <span className={styles.iconRestore} /> : <span className={styles.iconMax} />}
        </button>
        <button type="button" className={styles.closeBtn} aria-label="닫기" onClick={onClose}>
          <span className={styles.iconClose} />
        </button>
      </div>
    </header>
  );
}
