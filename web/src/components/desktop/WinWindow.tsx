"use client";

import { useState } from "react";
import type { OpenWindow } from "@/store/desktopStore";
import type { PortfolioPayload } from "@/types/portfolio";
import { WinExplorerHeader } from "@/components/explorer/WinExplorerHeader";
import { RecycleBinExplorerView } from "@/components/explorer/RecycleBinExplorerView";
import { ThisPcExplorerView } from "@/components/explorer/ThisPcExplorerView";
import { ChromeLegacyModal } from "./ChromeLegacyModal";
import { WindowContents } from "./WindowContents";
import styles from "./winWindow.module.scss";

function RecycleBinTitleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path fill="#8d8d8d" d="M5 2h6l1 1h3v2H1V3h3l1-1z" />
      <path fill="#c4c4c4" d="M2 5h12v9H2V5zm1 1v7h10V6H3z" />
      <path fill="#6b6b6b" d="M6 8h4v1H6V8zm0 2h3v1H6v-1z" />
    </svg>
  );
}

function MyPcTitleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <rect x="2" y="3" width="12" height="10" rx="1" fill="#e8e8e8" stroke="#9a9a9a" strokeWidth="1" />
      <rect x="4" y="5" width="8" height="6" fill="#c4c4c4" />
      <rect x="6" y="12" width="4" height="2" fill="#9a9a9a" />
    </svg>
  );
}

function DefaultExplorerIcon() {
  return <i className="fa-solid fa-folder" style={{ color: "#e8b931", fontSize: "15px" }} aria-hidden />;
}

type Props = {
  win: OpenWindow;
  data: PortfolioPayload;
  zIndex: number;
  stackIndex: number;
  isActive: boolean;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
};

function isExplorerShell(kind: OpenWindow["kind"]) {
  return kind === "recycle" || kind === "thisPc";
}

function titleLeading(win: OpenWindow) {
  if (win.kind === "recycle") return <RecycleBinTitleIcon />;
  if (win.kind === "thisPc") return <MyPcTitleIcon />;
  return <DefaultExplorerIcon />;
}

function minimizedLeading(win: OpenWindow) {
  return titleLeading(win);
}

export function WinWindow({ win, data, zIndex, stackIndex, isActive, onClose, onFocus }: Props) {
  const [maximized, setMaximized] = useState(false);
  const [minimized, setMinimized] = useState(false);

  if (win.kind === "chrome" && win.iframeUrl) {
    return (
      <ChromeLegacyModal
        zIndex={zIndex}
        stackIndex={stackIndex}
        iframeUrl={win.iframeUrl}
        activityChartUrl={win.githubActivityChartUrl}
        profileUrl={win.githubProfileUrl}
        onClose={() => onClose(win.id)}
        onFocus={() => onFocus(win.id)}
      />
    );
  }

  if (minimized) {
    return (
      <button
        type="button"
        className={styles.minimizedBtn}
        style={{
          zIndex,
          left: `max(8px, calc(50% - 90px + ${stackIndex * 168}px))`,
        }}
        title="복원"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => {
          setMinimized(false);
          onFocus(win.id);
        }}
      >
        {minimizedLeading(win)}
        <span className={styles.minimizedTitle}>{win.title}</span>
      </button>
    );
  }

  const frameClass = `${styles.frame} ${isActive ? styles.frameActive : ""}`;
  const explorer = isExplorerShell(win.kind);
  const stackX = stackIndex * 14;
  const stackY = stackIndex * 12;

  const sizeStyle = maximized
    ? {
        left: 0,
        top: 0,
        width: "100%",
        height: "calc(100vh - 50px)",
        transform: "none",
      }
    : {
        left: "50%",
        top: "50%",
        width: explorer ? "min(92vw, 700px)" : "min(92vw, 760px)",
        height: explorer ? "min(76vh, 520px)" : "min(78vh, min(640px, calc(100vh - 70px)))",
        transform: `translate(calc(-50% + ${stackX}px), calc(-50% + ${stackY}px))`,
      };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={win.title}
      onMouseDown={() => onFocus(win.id)}
      className={frameClass}
      style={{
        zIndex,
        ...sizeStyle,
      }}
    >
      <WinExplorerHeader
        title={win.title}
        leading={titleLeading(win)}
        maximized={maximized}
        onMinimize={() => setMinimized(true)}
        onMaximize={() => setMaximized((m) => !m)}
        onClose={() => onClose(win.id)}
      />

      {win.kind === "recycle" ? (
        <RecycleBinExplorerView />
      ) : win.kind === "thisPc" ? (
        <ThisPcExplorerView />
      ) : (
        <div className={styles.bodyScroll}>
          <WindowContents win={win} data={data} />
        </div>
      )}
    </div>
  );
}
