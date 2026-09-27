"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaBluetoothB, FaMagnifyingGlass, FaWindows } from "react-icons/fa6";
import type { OpenWindow } from "@/store/desktopStore";
import { IconBattery, IconChat, IconChevronUp, IconVolume, IconWifi } from "./TrayIcons";
import { WindowsStartMenu } from "./WindowsStartMenu";

type Props = {
  compact?: boolean;
  open: OpenWindow[];
  activeId: string | null;
  onFocus: (id: string) => void;
  onOpenGithub: () => void;
  dsHelperUrl: string;
  onOpenWindowById: (windowId: string) => void;
};

function formatLegacyClock(now: Date) {
  const y = now.getFullYear();
  const mo = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const hour = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const hour2 = now.getHours() - 12;
  let line1: string;
  if (hour <= 12) {
    line1 = `오전 ${hour}:${minutes}`;
  } else {
    line1 = `오후 ${hour2}:${minutes}`;
  }
  const line2 = `${y}-${mo}-${d}`;
  return { line1, line2 };
}

const lnbHover = "transition-colors text-center duration-200 hover:bg-[#e6e6e6]";
const trayButton = `flex h-[50px] w-6 cursor-default items-center justify-center bg-transparent text-[#222] ${lnbHover}`;
const trayIcon = "inline-flex h-4 w-4 items-center justify-center [&_svg]:block [&_svg]:h-full [&_svg]:w-full";

export function Lnb({
  compact = false,
  open,
  activeId,
  onFocus,
  onOpenGithub,
  dsHelperUrl,
  onOpenWindowById,
}: Props) {
  const [clock, setClock] = useState(() => formatLegacyClock(new Date()));
  const [taskHover, setTaskHover] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const moreBtnRef = useRef<HTMLButtonElement>(null);
  const moreWrapRef = useRef<HTMLDivElement>(null);
  const startBtnRef = useRef<HTMLButtonElement>(null);
  const startPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      setClock(formatLegacyClock(new Date()));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  useLayoutEffect(() => {
    if (!moreOpen || !moreBtnRef.current || !moreWrapRef.current) return;
    const r = moreBtnRef.current.getBoundingClientRect();
    const el = moreWrapRef.current;
    el.style.left = `${r.left + r.width / 2}px`;
    el.style.transform = "translateX(-50%)";
  }, [moreOpen]);

  useEffect(() => {
    if (!startOpen) return;
    const k = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setStartOpen(false);
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [startOpen]);

  useEffect(() => {
    if (!moreOpen && !startOpen) return;
    const h = (e: MouseEvent) => {
      const path = e.composedPath();
      if (moreBtnRef.current && path.includes(moreBtnRef.current)) return;
      if (moreWrapRef.current && path.includes(moreWrapRef.current)) return;
      if (startBtnRef.current && path.includes(startBtnRef.current)) return;
      if (startPanelRef.current && path.includes(startPanelRef.current)) return;
      setMoreOpen(false);
      setStartOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [moreOpen, startOpen]);

  return (
    <>
      {moreOpen && (
        <div
          ref={moreWrapRef}
          className="fixed bottom-[49px] z-[110] flex max-w-[80px] border border-[#aaa] bg-winBar shadow-task backdrop-blur-[1px]"
          role="menu"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className={`flex h-10 w-10 items-center justify-center bg-transparent text-[#222] ${lnbHover}`}
            aria-label="Bluetooth"
          >
            <FaBluetoothB className="text-[#0082fc]" aria-hidden />
          </button>
          <button
            type="button"
            className={`flex h-10 w-10 items-center justify-center bg-transparent text-[#222] ${lnbHover}`}
            aria-label="Windows 보안"
          >
            <Image src="/img/protect-remove.png" alt="" width={18} height={18} className="object-contain" unoptimized />
          </button>
        </div>
      )}

      {startOpen && (
        <WindowsStartMenu
          ref={startPanelRef}
          dsHelperUrl={dsHelperUrl}
          onClose={() => setStartOpen(false)}
          onOpenGitHub={onOpenGithub}
          onOpenWindowById={onOpenWindowById}
          onOpenExternal={(url) => window.open(url, "_blank", "noopener,noreferrer")}
        />
      )}

      <div className="fixed bottom-0 left-0 z-[100] flex h-[50px] w-full items-end bg-winBar text-[0] shadow-task backdrop-blur-[1px]">
        <div className="flex shrink-0 items-end">
          <button
            ref={startBtnRef}
            type="button"
            className={`gnb_btn flex h-[49px] w-12 cursor-inherit items-center justify-center bg-transparent text-[21px] text-[#222] ${lnbHover}`}
            aria-label="시작"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setStartOpen((v) => !v);
              setMoreOpen(false);
            }}
          >
            <FaWindows aria-hidden />
          </button>
          <button
            type="button"
            className={`${compact ? "hidden" : "flex"} h-[49px] w-12 cursor-inherit items-center justify-center bg-transparent text-[21px] text-[#222] [transform:rotateY(180deg)] ${lnbHover}`}
            aria-label="검색"
          >
            <FaMagnifyingGlass aria-hidden />
          </button>
          <button
            type="button"
            className={`${compact ? "hidden" : "flex"} h-[49px] w-12 cursor-inherit items-center justify-center bg-transparent text-[21px] text-[#222] ${lnbHover}`}
            aria-label="작업 보기"
            onMouseEnter={() => setTaskHover(true)}
            onMouseLeave={() => setTaskHover(false)}
          >
            <Image
              src={taskHover ? "/img/task02-remove.png" : "/img/task-remove.png"}
              alt=""
              width={18}
              height={18}
              className="h-auto w-[35%] object-contain"
              unoptimized
            />
          </button>
          <button
            type="button"
            className={`folder_btn ${compact ? "hidden" : "flex"} h-[49px] w-12 cursor-inherit items-center justify-center bg-transparent text-[21px] text-[#222] ${lnbHover}`}
            aria-label="탐색기"
          >
            <Image
              src="/img/folder_lnb.png"
              alt=""
              width={22}
              height={22}
              className="h-auto w-1/2 object-contain"
              unoptimized
            />
          </button>
        </div>

        <div className={`absolute bottom-0 ${compact ? "left-[52px] right-[140px]" : "left-[196px] right-[300px]"} flex h-[50px] items-end justify-start gap-0.5 overflow-x-auto overflow-y-hidden pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>
          {open.map((w) => (
            <button
              key={w.id}
              type="button"
              title={w.title}
              aria-label={w.title}
              data-taskbar-window={w.id}
              className={`mb-0.5 flex h-[46px] max-w-[10rem] cursor-default items-center gap-1.5 border border-transparent px-2 py-0 text-xs text-[#111] ${lnbHover} ${
                w.id === activeId || w.minimized ? "border-[rgba(0,120,212,0.35)] bg-white/70" : ""
              }`}
              onClick={() => onFocus(w.id)}
            >
                <span className="relative h-7 w-7 shrink-0">
                  <Image
                    src={w.taskbarIconUrl || "/icons/desktop/folderIcon.png"}
                    alt=""
                    fill
                    sizes="28px"
                    className="object-contain"
                    unoptimized
                  />
                </span>
            </button>
          ))}
        </div>

        <div className="absolute bottom-0 right-0 flex h-[50px] items-start">
          <div className={`${compact ? "hidden" : "flex"} mr-1 h-[50px] items-center`}>
            <button
              ref={moreBtnRef}
              type="button"
              className={trayButton}
              title="숨겨진 아이콘 표시"
              aria-expanded={moreOpen}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setMoreOpen((v) => !v);
                setStartOpen(false);
              }}
            >
              <span className={trayIcon}><IconChevronUp /></span>
            </button>
            <button type="button" className={trayButton} aria-label="배터리" title="배터리">
              <span className={trayIcon}>
                <IconBattery />
              </span>
            </button>
            <button type="button" className={trayButton} aria-label="Wi-Fi" title="Wi-Fi">
              <span className={trayIcon}>
                <IconWifi />
              </span>
            </button>
            <button type="button" className={trayButton} aria-label="볼륨" title="볼륨">
              <span className={trayIcon}>
                <IconVolume />
              </span>
            </button>
          </div>
          <div className={`box-border flex h-[50px] w-[88px] cursor-default flex-col items-center justify-center gap-0.5 px-1 text-[13px] text-[#111] ${lnbHover}`}>
            <p className="m-0 leading-4">{clock.line1}</p>
            <span className="m-0 leading-4">{clock.line2}</span>
          </div>
          <div className="flex items-start">
            <button type="button" className={`flex h-[50px] w-11 cursor-default items-center justify-center bg-transparent text-[#222] ${lnbHover}`} aria-label="알림 센터" title="알림 센터">
              <span className="inline-flex h-5 w-5 items-center justify-center [&_svg]:block [&_svg]:h-full [&_svg]:w-full">
                <IconChat />
              </span>
            </button>
          </div>
          <div aria-hidden className="h-[50px] w-[5px] border-l border-black/20" />
        </div>
      </div>
    </>
  );
}
