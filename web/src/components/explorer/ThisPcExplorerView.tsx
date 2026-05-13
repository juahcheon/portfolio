"use client";

import layout from "./recycleBinExplorer.module.scss";
import styles from "./thisPcExplorer.module.scss";
import { ExplorerFolderIcon } from "./ExplorerFolderIcon";
import { ExplorerSidebar } from "./ExplorerSidebar";

const folders = [
  "3D 개체",
  "다운로드",
  "동영상",
  "문서",
  "바탕 화면",
  "사진",
  "음악",
];

const drives = [
  { label: "로컬 디스크 (C:)", meta: "207GB 중 120GB 사용 가능", pct: 42, showWin: true },
  { label: "새 볼륨 (D:)", meta: "24.8GB 중 15.7GB 사용 가능", pct: 37, showWin: false },
];

export function ThisPcExplorerView() {
  return (
    <div className={layout.shell}>
      <div className={layout.commandBar}>
        <div className={layout.navCluster}>
          <button type="button" className={layout.navBtn} aria-label="뒤로" title="뒤로">
            <i className="fa-solid fa-arrow-left" />
          </button>
          <button type="button" className={layout.navBtn} aria-label="앞으로" title="앞으로">
            <i className="fa-solid fa-arrow-right" />
          </button>
          <button type="button" className={layout.navBtn} aria-label="상위 폴더" title="상위 폴더">
            <i className="fa-solid fa-arrow-up" />
          </button>
        </div>
        <div className={layout.addressBox}>
          <i className="fa-solid fa-desktop" style={{ color: "#606060", fontSize: "12px" }} aria-hidden />
          <span className={layout.addressCrumb}>&gt; 내 PC</span>
        </div>
        <button type="button" className={layout.refreshBtn} aria-label="새로 고침">
          <i className="fa-solid fa-rotate-right" />
        </button>
        <div className={layout.searchWrap}>
          <input className={layout.searchInput} type="search" placeholder="내 PC 검색" readOnly aria-readonly />
          <i className={`fa-solid fa-magnifying-glass ${layout.searchMag}`} aria-hidden />
        </div>
      </div>

      <div className={layout.mainRow}>
        <ExplorerSidebar thisPcSelected />
        <div className={layout.listPane}>
          <div className={layout.tableScroll}>
            <div className={styles.folderSection}>
              <div className={styles.sectionHead}>
                <i className={`fa-solid fa-chevron-down ${styles.chevron}`} aria-hidden />
                <span>폴더 (7)</span>
              </div>
              <div className={styles.folderGrid}>
                {folders.map((name) => (
                  <div key={name} className={styles.folderTile}>
                    <ExplorerFolderIcon width={48} height={48} title={name} />
                    <span className={styles.folderLabel}>{name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.driveSection}>
              <div className={styles.sectionHead}>
                <i className={`fa-solid fa-chevron-down ${styles.chevron}`} aria-hidden />
                <span>장치 및 드라이브 (2)</span>
              </div>
              {drives.map((d) => (
                <div key={d.label} className={styles.driveRow}>
                  <div className={styles.driveIconWrap}>
                    <i className={`fa-solid fa-hard-drive ${styles.driveIcon}`} aria-hidden />
                    {d.showWin ? (
                      <span className={styles.windowsLogo} aria-hidden>
                        <i className="fa-brands fa-windows" />
                      </span>
                    ) : null}
                  </div>
                  <div className={styles.driveBody}>
                    <div className={styles.driveTitle}>{d.label}</div>
                    <div className={styles.driveBar}>
                      <div className={styles.driveBarFill} style={{ width: `${d.pct}%` }} />
                    </div>
                    <div className={styles.driveMeta}>{d.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={layout.statusBar}>
            <span>9개 항목</span>
            <div className={layout.statusRight}>
              <button type="button" className={layout.statusIconBtn} aria-label="자세히">
                <i className="fa-solid fa-list" />
              </button>
              <button type="button" className={layout.statusIconBtn} aria-label="큰 아이콘">
                <i className="fa-regular fa-square" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
