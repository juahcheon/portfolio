"use client";

import { useEffect, useMemo, useState } from "react";
import type { DesktopIcon, PortfolioPayload } from "@/types/portfolio";
import { useDesktopStore } from "@/store/desktopStore";
import {
  githubWindow,
  openWindowFromDesktopId,
  timelineWindow,
} from "@/lib/windows";
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

  const imageShapeClass =
    icon.shape === "circle"
      ? "rounded-full"
      : icon.shape === "rounded10"
        ? "rounded-[10px]"
        : "";

  const activate = () => {
    if (icon.action === "external" && icon.url) {
      window.open(icon.url, "_blank", "noopener,noreferrer");
      return;
    }
    if (icon.action === "window" && icon.windowId) {
      const w = openWindowFromDesktopId(icon.windowId, data);
      if (w) openWindow({ ...w, taskbarIconUrl: icon.imageUrl });
    }
  };

  return (
    <li className="m-0 list-none p-0">
      <button
        type="button"
        title="더블 클릭 또는 Enter로 열기"
        className={`box-border flex min-h-[88px] w-[95px] cursor-default flex-col items-center justify-center overflow-visible border border-transparent bg-transparent px-0 py-1.5 ${
          selected
            ? "border-[#add7ff7d] bg-[#80b9ee72] hover:bg-[#80b9ee72]"
            : "hover:bg-[#559de464]"
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
        <figure className="m-0 flex w-full max-w-[95px] shrink-0 flex-col items-center justify-center gap-0.5">
          {!imgFailed ? (
            <img
              src={icon.imageUrl}
              alt=""
              width={51}
              height={51}
              className={`h-[51px] w-[51px] shrink-0 object-contain ${imageShapeClass}`}
              draggable={false}
              decoding="async"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div
              className={`flex h-[51px] w-[51px] shrink-0 items-center justify-center border border-white/40 bg-gradient-to-br from-white/35 to-black/20 text-[22px] font-bold text-white [text-shadow:-1px_0_#000,0_1px_#000,1px_0_#000,0_-1px_#000] ${
                icon.shape === "circle" ? "rounded-full" : icon.shape === "rounded10" ? "rounded-[10px]" : "rounded"
              }`}
              title={icon.label}
              aria-hidden
            >
              {icon.label.slice(0, 1)}
            </div>
          )}
          <figcaption className="w-full max-w-[95px] shrink-0 break-words px-0.5 text-center text-[13px] font-normal leading-snug text-white [text-shadow:-1px_0_#000,0_1px_#000,1px_0_#000,0_-1px_#000]">
            {icon.label}
          </figcaption>
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

  const dsHelperUrl = useMemo(
    () => data.desktop.icons.find((i) => i.id === "dshelper")?.url ?? "https://dshelper.kr/",
    [data.desktop.icons]
  );

  return (
    <div
      className="relative h-screen w-full"
      style={{ backgroundColor: wallpaper }}
      onClick={() => setSelectedIconId(null)}
    >
      <div
        className="relative flex h-full w-full flex-row items-start pb-[50px]"
        onClick={() => setSelectedIconId(null)}
      >
        {columns.map((col, colIdx) =>
          col.length === 0 ? null : (
            <ul
              key={colIdx}
              className="m-0 flex w-[100px] shrink-0 list-none flex-col items-center gap-5 p-0"
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
        dsHelperUrl={dsHelperUrl}
        onOpenWindowById={(windowId) => {
          const w = openWindowFromDesktopId(windowId, data);
          if (w) openWindow(w);
        }}
      />
    </div>
  );
}
