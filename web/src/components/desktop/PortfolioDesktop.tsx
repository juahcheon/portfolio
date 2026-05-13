"use client";

import { useEffect, useMemo, useState } from "react";
import type { DesktopIcon, PortfolioPayload } from "@/types/portfolio";
import { useDesktopStore } from "@/store/desktopStore";
import {
  githubWindow,
  openWindowFromDesktopId,
  timelineWindow,
} from "@/lib/windows";
import styles from "@/styles/windowsDesktop.module.scss";
import { WinWindow } from "./WinWindow";
import { Lnb } from "./Lnb";

function groupByColumn(icons: DesktopIcon[]) {
  const maxCol = icons.reduce((m, i) => Math.max(m, i.column), 0);
  const cols: DesktopIcon[][] = Array.from({ length: maxCol + 1 }, () => []);
  icons.forEach((icon) => {
    cols[icon.column].push(icon);
  });
  return cols;
}

function DesktopIconButton({
  icon,
  data,
  selectedId,
  onSelect,
}: {
  icon: DesktopIcon;
  data: PortfolioPayload;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const openWindow = useDesktopStore((s) => s.openWindow);
  const selected = selectedId === icon.id;
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [icon.imageUrl]);

  const activate = () => {
    if (icon.action === "external" && icon.url) {
      window.open(icon.url, "_blank", "noopener,noreferrer");
      return;
    }
    if (icon.action === "window" && icon.windowId) {
      const w = openWindowFromDesktopId(icon.windowId, data);
      if (w) openWindow(w);
    }
  };

  return (
    <li className={styles.desktopIconSlot}>
      <button
        type="button"
        title="더블 클릭 또는 Enter로 열기"
        className={`${styles.desktopIconBtn} ${selected ? styles.desktopIconSelected : ""} ${
          icon.gapAfter === "none" ? styles.desktopIconBtnTight : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(icon.id);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          activate();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            activate();
          }
        }}
      >
        <figure>
          {!imgFailed ? (
            <img
              src={icon.imageUrl}
              alt=""
              width={51}
              height={51}
              className={styles.mainImg}
              draggable={false}
              decoding="async"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className={styles.mainImgFallback} title={icon.label} aria-hidden>
              {icon.label.slice(0, 1)}
            </div>
          )}
          <figcaption className={styles.caption}>{icon.label}</figcaption>
        </figure>
      </button>
    </li>
  );
}

export function PortfolioDesktop({ data }: { data: PortfolioPayload }) {
  const wallpaper = data.desktop.wallpaper;
  const columns = useMemo(
    () => groupByColumn(data.desktop.icons),
    [data.desktop.icons]
  );
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);

  const open = useDesktopStore((s) => s.open);
  const activeId = useDesktopStore((s) => s.activeId);
  const openWindow = useDesktopStore((s) => s.openWindow);
  const closeWindow = useDesktopStore((s) => s.closeWindow);
  const focusWindow = useDesktopStore((s) => s.focusWindow);

  return (
    <div
      className={styles.wrap}
      style={{ backgroundColor: wallpaper }}
      onClick={() => setSelectedIconId(null)}
    >
      <div className={styles.bgimg} onClick={() => setSelectedIconId(null)}>
        {columns.map((col, colIdx) =>
          col.length === 0 ? null : (
            <ul
              key={colIdx}
              className={styles.iconColumnWrap}
              style={{ left: colIdx * 100 }}
            >
              {col.map((icon) => (
                <DesktopIconButton
                  key={icon.id}
                  icon={icon}
                  data={data}
                  selectedId={selectedIconId}
                  onSelect={setSelectedIconId}
                />
              ))}
            </ul>
          )
        )}
      </div>

      {open.map((win, idx) => (
        <WinWindow
          key={win.id}
          win={win}
          data={data}
          zIndex={win.id === activeId ? 80 : 20 + idx}
          stackIndex={idx}
          isActive={win.id === activeId}
          onClose={closeWindow}
          onFocus={focusWindow}
        />
      ))}

      <Lnb
        open={open}
        activeId={activeId}
        onFocus={focusWindow}
        onOpenGithub={() => openWindow(githubWindow())}
        onOpenTimeline={() => openWindow(timelineWindow())}
      />
    </div>
  );
}
