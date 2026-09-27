"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useDesktopViewport } from "@/hooks/useDesktopViewport";
import type { DesktopIcon, PortfolioPayload } from "@/types/portfolio";
import { useDesktopStore } from "@/store/desktopStore";
import {
  githubWindow,
  openWindowFromDesktopId,
} from "@/lib/windows";
import { WinWindow } from "./WinWindow";
import { Lnb } from "./Lnb";
import { DesktopNavigation } from "./DesktopNavigation";
import { MobileTaskbar } from "./MobileTaskbar";
import { MobileHome } from "./MobileHome";

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
  mobile = false,
}: {
  icon: DesktopIcon;
  data: PortfolioPayload;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  mobile?: boolean;
}) {
  const openWindow = useDesktopStore((s) => s.openWindow);
  const selected = selectedId === icon.id;
  const [imgFailed, setImgFailed] = useState(false);
  const touchPointer = useRef(false);

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
        title={mobile ? icon.label : "터치 또는 더블 클릭, Enter로 열기"}
        onPointerDown={(event) => { touchPointer.current = event.pointerType !== "mouse"; }}
        className={mobile ? "box-border flex min-h-[92px] w-[95px] max-w-full cursor-pointer flex-col items-center justify-center rounded-[22px] px-0 py-2 transition-colors active:bg-white/15 focus-visible:outline focus-visible:outline-white" : `box-border flex min-h-[88px] w-[95px] max-w-full cursor-default flex-col items-center justify-center overflow-visible border border-transparent bg-transparent px-0 py-1.5 ${
          selected
            ? "border-[#add7ff7d] bg-[#80b9ee72] hover:bg-[#80b9ee72]"
            : "hover:bg-[#559de464]"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(icon.id);
          if (mobile || touchPointer.current) activate();
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (!mobile && !touchPointer.current) activate();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            activate();
          }
        }}
      >
        <figure className={`m-0 flex w-full max-w-[95px] shrink-0 flex-col items-center justify-center ${mobile ? "gap-2" : "gap-0.5"}`}>
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
          <figcaption className={`w-full max-w-[95px] shrink-0 break-words px-0.5 text-center text-[13px] leading-snug text-white ${mobile ? "font-medium [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]" : "font-normal [text-shadow:-1px_0_#000,0_1px_#000,1px_0_#000,0_-1px_#000]"}`}>
            {mobile && icon.windowId === "cmd" ? "CMD" : icon.label}
          </figcaption>
        </figure>
      </button>
    </li>
  );
}

export function PortfolioDesktop({ data }: { data: PortfolioPayload }) {
  const viewport = useDesktopViewport();
  const mobile = viewport?.mobile ?? false;
  const initialized = useRef(false);
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
  const minimizeWindow = useDesktopStore((s) => s.minimizeWindow);

  useEffect(() => {
    if (!mobile) return;
    open.filter((win) => !win.minimized && (win.kind === "recycle" || win.kind === "thisPc")).forEach((win) => minimizeWindow(win.id));
  }, [mobile, open, minimizeWindow]);

  const dsHelperUrl = useMemo(
    () => data.desktop.icons.find((i) => i.id === "dshelper")?.url ?? "https://test.dshelper.kr/",
    [data.desktop.icons]
  );

  useEffect(() => {
    if (!viewport || initialized.current) return;
    initialized.current = true;
    if (viewport.mobile) return;
    const w = openWindowFromDesktopId("about", data);
    if (w) {
      const icon = data.desktop.icons.find((i) => i.windowId === "about");
      openWindow({ ...w, taskbarIconUrl: icon?.imageUrl });
    }
  }, [viewport, data, openWindow]);

  if (!viewport) return <div className="h-dvh bg-desk" />;

  return (
    <div
      className={`relative w-full ${mobile ? "mobile-desktop overflow-hidden" : "h-dvh"}`}
      style={{ backgroundColor: wallpaper, ...(mobile ? { "--desktop-height": `${viewport.height}px`, "--mobile-accent": wallpaper, height: "var(--desktop-height)" } : {}) } as CSSProperties}
      onClick={() => setSelectedIconId(null)}
    >
      <div inert={mobile && activeId !== null} className={mobile ? "h-full overflow-y-auto pb-[calc(100px+env(safe-area-inset-bottom))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : "contents"} style={mobile && activeId !== null ? { visibility: "hidden" } : undefined}>
      {mobile ? <MobileHome data={data} /> : <>
      <div
        className="relative flex h-full w-full flex-row items-start overflow-y-auto pb-[50px]"
        onClick={() => setSelectedIconId(null)}
      >
        {columns.map((col, colIdx) =>
          col.length === 0 ? null : (
            <ul
              key={colIdx}
              className={mobile ? "contents" : "m-0 flex w-[100px] shrink-0 list-none flex-col items-center gap-5 p-0"}
            >
              {col.map((icon) => (
                <DesktopIconButton
                  key={icon.id}
                  icon={icon}
                  data={data}
                  selectedId={selectedIconId}
                  onSelect={setSelectedIconId}
                  mobile={mobile}
                />
              ))}
            </ul>
          )
        )}
      </div>
      </>}
      </div>

      {open.map((win, idx) => (
        <div key={win.id} inert={mobile && (win.id !== activeId || win.minimized)} style={{ display: mobile && (win.id !== activeId || win.minimized) ? "none" : "contents" }}>
        <WinWindow
          mobile={mobile}
          compact={viewport.compact}
          win={win}
          data={data}
          zIndex={win.id === activeId ? 80 : 20 + idx}
          stackIndex={idx}
          onClose={closeWindow}
          onFocus={focusWindow}
        />
        </div>
      ))}

      {!mobile && data.desktop.exploreGuide ? (
        <DesktopNavigation
          guide={data.desktop.exploreGuide}
          icons={data.desktop.icons}
          onOpenWindow={(windowId) => {
            const win = openWindowFromDesktopId(windowId, data);
            const icon = data.desktop.icons.find((item) => item.windowId === windowId);
            if (win) openWindow({ ...win, taskbarIconUrl: icon?.imageUrl });
          }}
        />
      ) : null}

      {mobile ? <MobileTaskbar data={data} /> : <Lnb
        compact={viewport.compact}
        open={open}
        activeId={activeId}
        onFocus={focusWindow}
        onOpenGithub={() => openWindow(githubWindow())}
        dsHelperUrl={dsHelperUrl}
        onOpenWindowById={(windowId) => {
          const w = openWindowFromDesktopId(windowId, data);
          if (w) openWindow(w);
        }}
      />}
    </div>
  );
}
