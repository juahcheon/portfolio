"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { OpenWindow } from "@/store/desktopStore";
import styles from "@/styles/lnb.module.scss";
import { IconBattery, IconChat, IconVolume, IconWifi } from "./TrayIcons";

type Props = {
  open: OpenWindow[];
  activeId: string | null;
  onFocus: (id: string) => void;
  onOpenGithub: () => void;
  onOpenTimeline: () => void;
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

export function Lnb({
  open,
  activeId,
  onFocus,
  onOpenGithub,
  onOpenTimeline,
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
    el.style.left = `${r.left + 15}px`;
    el.style.transform = "translateX(-50%)";
  }, [moreOpen]);

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
          className={styles.moreWrap}
          role="menu"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button type="button" className={`${styles.moreIcon} ${styles.lnbHover}`} aria-label="Bluetooth">
            <i className="fa-brands fa-bluetooth" style={{ color: "#0082fc" }} />
          </button>
          <button type="button" className={`${styles.moreIcon} ${styles.lnbHover}`} aria-label="Windows 보안">
            <Image src="/img/protect-remove.png" alt="" width={18} height={18} className="object-contain" unoptimized />
          </button>
        </div>
      )}

      {startOpen && (
        <div
          ref={startPanelRef}
          className={styles.startFlyout}
          role="menu"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className={`${styles.moreIcon} ${styles.lnbHover}`}
            style={{ width: "100%", justifyContent: "flex-start", paddingLeft: 8, height: 36 }}
            onClick={() => {
              onOpenGithub();
              setStartOpen(false);
            }}
          >
            GitHub
          </button>
          <button
            type="button"
            className={`${styles.moreIcon} ${styles.lnbHover}`}
            style={{ width: "100%", justifyContent: "flex-start", paddingLeft: 8, height: 36 }}
            onClick={() => {
              onOpenTimeline();
              setStartOpen(false);
            }}
          >
            타임라인
          </button>
        </div>
      )}

      <div className={styles.lnb}>
        <div className={styles.leftLnb}>
          <button
            ref={startBtnRef}
            type="button"
            className={`${styles.leftBtn} ${styles.lnbHover} gnb_btn`}
            aria-label="시작"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setStartOpen((v) => !v);
              setMoreOpen(false);
            }}
          >
            <i className="fa-brands fa-windows" />
          </button>
          <button
            type="button"
            className={`${styles.leftBtn} ${styles.lnbHover} ${styles.searchBtn}`}
            aria-label="검색"
          >
            <i className="fa-solid fa-magnifying-glass" />
          </button>
          <button
            type="button"
            className={`${styles.leftBtn} ${styles.lnbHover}`}
            aria-label="작업 보기"
            onMouseEnter={() => setTaskHover(true)}
            onMouseLeave={() => setTaskHover(false)}
          >
            <Image
              src={taskHover ? "/img/task02-remove.png" : "/img/task-remove.png"}
              alt=""
              width={18}
              height={18}
              className="object-contain"
              style={{ width: "35%", height: "auto" }}
              unoptimized
            />
          </button>
          <button type="button" className={`${styles.leftBtn} ${styles.lnbHover} folder_btn`} aria-label="탐색기">
            <Image
              src="/img/folder_lnb.png"
              alt=""
              width={22}
              height={22}
              className="object-contain"
              style={{ width: "50%", height: "auto" }}
              unoptimized
            />
          </button>
        </div>

        <div className={styles.centerRunning}>
          {open.map((w) => (
            <button
              key={w.id}
              type="button"
              className={`${styles.runningBtn} ${styles.lnbHover} ${
                w.id === activeId ? styles.runningBtnActive : ""
              }`}
              onClick={() => onFocus(w.id)}
            >
              {w.title}
            </button>
          ))}
        </div>

        <div className={styles.rightLnb}>
          <div className={styles.rightIcons}>
            <button
              ref={moreBtnRef}
              type="button"
              className={`${styles.moreOption} ${styles.rightBtn} ${styles.lnbHover}`}
              title="숨겨진 아이콘 표시"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setMoreOpen((v) => !v);
                setStartOpen(false);
              }}
            >
              <i className="fa-solid fa-chevron-up" />
            </button>
            <button type="button" className={`${styles.rightBtn} ${styles.lnbHover}`} aria-label="배터리">
              <span className={styles.lowBattery}>
                <IconBattery />
              </span>
            </button>
            <button type="button" className={`${styles.rightBtn} ${styles.lnbHover}`} aria-label="Wi-Fi">
              <span className={styles.wifi}>
                <IconWifi />
              </span>
            </button>
            <button type="button" className={`${styles.rightBtn} ${styles.lnbHover}`} aria-label="볼륨">
              <span className={styles.volume}>
                <IconVolume />
              </span>
            </button>
          </div>
          <div className={`${styles.timeAndDate} ${styles.lnbHover}`}>
            <p className={styles.timeLine}>{clock.line1}</p>
            <span className={styles.dateLine}>{clock.line2}</span>
          </div>
          <div className={styles.noticeTown}>
            <button type="button" className={`${styles.noticeBtn} ${styles.lnbHover}`} aria-label="알림 센터">
              <span className={styles.chatIcon}>
                <IconChat />
              </span>
              <div className={styles.noticeCenter}>
                <p>5</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
