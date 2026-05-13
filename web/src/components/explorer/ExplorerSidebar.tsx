"use client";

import Link from "next/link";
import { ExplorerFolderIcon } from "./ExplorerFolderIcon";
import styles from "./explorerSidebar.module.scss";

const favorites = [
  { label: "바탕 화면", pin: true },
  { label: "다운로드", pin: true },
  { label: "문서", pin: true },
  { label: "사진", pin: true },
  { label: ".claude", pin: false },
  { label: "01_banchan", pin: false },
  { label: "project", pin: false },
  { label: "매력일자리", pin: false },
];

type Props = {
  /** 내 PC 창일 때 사이드바에서 '내 PC' 항목 선택 표시 */
  thisPcSelected?: boolean;
};

export function ExplorerSidebar({ thisPcSelected = false }: Props) {
  return (
    <nav className={styles.root} aria-label="탐색기 내비게이션">
      <div className={styles.sectionLabel}>
        <i className={`fa-solid fa-star ${styles.starIcon}`} aria-hidden />
        <span>즐겨찾기</span>
      </div>
      {favorites.map((item) => (
        <div key={item.label} className={styles.navItem}>
          <span className={styles.folderGlyph}>
            <ExplorerFolderIcon width={16} height={16} title={item.label} />
          </span>
          <span>{item.label}</span>
          {item.pin ? (
            <i className={`fa-solid fa-thumbtack ${styles.pin}`} aria-hidden />
          ) : null}
        </div>
      ))}

      <div className={styles.divider} />

      <div className={styles.navItem}>
        <i className={`fa-brands fa-microsoft ${styles.cloudIcon}`} aria-hidden />
        <span>OneDrive - Personal</span>
      </div>

      <Link
        href="/"
        className={`${styles.thisPcLink} ${thisPcSelected ? styles.thisPcLinkActive : ""}`}
        title="포트폴리오 바탕화면으로 이동"
      >
        <i className={`fa-solid fa-desktop ${styles.pcIcon}`} aria-hidden />
        <span>내 PC</span>
      </Link>

      <div className={styles.navItem}>
        <i className={`fa-solid fa-network-wired ${styles.netIcon}`} aria-hidden />
        <span>네트워크</span>
      </div>
    </nav>
  );
}
