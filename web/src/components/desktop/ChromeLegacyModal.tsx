"use client";

import { useState } from "react";
import styles from "@/styles/chromeLegacyModal.module.scss";

type Props = {
  zIndex: number;
  iframeUrl: string;
  onClose: () => void;
  onFocus: () => void;
};

export function ChromeLegacyModal({ zIndex, iframeUrl, onClose, onFocus }: Props) {
  const [maximized, setMaximized] = useState(false);

  return (
    <div
      className={`${styles.pageModal} ${maximized ? styles.pageModalMax : ""}`}
      style={{ zIndex }}
      role="dialog"
      aria-label="Chrome"
      onMouseDown={onFocus}
    >
      <div className={styles.modalWrap}>
        <div className={styles.modalHeader}>
          <div className={styles.headerPage}>
            <div className={styles.openPage}>
              <ul>
                <li className={`${styles.activePage} ${styles.hoverLight}`}>
                  <a href="#" onClick={(e) => e.preventDefault()} aria-hidden />
                  <button type="button" className={`${styles.exitPage} ${styles.hoverDark}`} aria-label="탭 닫기">
                    <i className="fa-solid fa-xmark" />
                  </button>
                </li>
                <li className={styles.hoverLight}>
                  <a href="#" onClick={(e) => e.preventDefault()} aria-hidden />
                  <button type="button" className={`${styles.exitPage} ${styles.hoverDark}`} aria-label="탭 닫기">
                    <i className="fa-solid fa-xmark" />
                  </button>
                </li>
                <button type="button" className={`${styles.newPage} ${styles.hoverDark}`} aria-label="새 탭">
                  <i className="fa-solid fa-plus" />
                </button>
              </ul>
            </div>
            <div className={styles.headerRight}>
              <button type="button" className={styles.hoverDark} aria-label="메뉴">
                <i className="fa-solid fa-chevron-down" />
              </button>
              <button type="button" className={`${styles.minimize} ${styles.hoverDark}`} aria-label="최소화">
                <i className="fa-solid fa-window-minimize" />
              </button>
              <button
                type="button"
                className={`${styles.hoverDark}`}
                aria-label="최대화"
                onClick={(e) => {
                  e.stopPropagation();
                  setMaximized((m) => !m);
                }}
              >
                <i className="fa-regular fa-square" />
              </button>
              <button
                type="button"
                className={styles.hoverDark}
                aria-label="닫기"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          </div>
          <div className={styles.headerAddress}>
            <div className={styles.addressMove}>
              <button type="button" aria-label="뒤로">
                <i className="fa-solid fa-arrow-left" />
              </button>
              <button type="button" aria-label="앞으로">
                <i className="fa-solid fa-arrow-right" />
              </button>
              <button type="button" aria-label="새로고침">
                <i className="fa-solid fa-rotate-right" />
              </button>
            </div>
            <div className={styles.addressDetail}>
              <button type="button" aria-label="보안">
                <i className="fa-solid fa-lock" />
              </button>
              <p className={styles.addressUrl}>{iframeUrl}</p>
              <button type="button" aria-label="북마크">
                <i className="fa-regular fa-star" />
              </button>
            </div>
            <button type="button" className={`${styles.settingChrome} ${styles.hoverDark}`} aria-label="설정">
              <i className="fa-solid fa-ellipsis-vertical" />
            </button>
          </div>
        </div>
        <div className={styles.modalBody}>
          <iframe title="Chrome" src={iframeUrl} className={styles.iframe} />
        </div>
      </div>
    </div>
  );
}
