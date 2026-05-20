"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  FiChevronDown,
  FiFileText,
} from "react-icons/fi";
import {
  SiAndroidstudio,
  SiDiscord,
  SiDocker,
  SiGithub,
  SiGooglechrome,
  SiKakaotalk,
  SiNodedotjs,
  SiPython,
} from "react-icons/si";
import { IoMenuOutline } from "react-icons/io5";
import { LiaUserSolid } from "react-icons/lia";
import { HiOutlineDocument } from "react-icons/hi2";
import { PiImage } from "react-icons/pi";
import { TfiPowerOff } from "react-icons/tfi";
import { CiSettings } from "react-icons/ci";
import { TbBrandVscode } from "react-icons/tb";
import { FaFolder } from "react-icons/fa";
import { MdOutlineRocketLaunch } from "react-icons/md";
import styles from "./WindowsStartMenu.module.scss";

export type WindowsStartMenuProps = {
  onClose: () => void;
  onOpenGitHub: () => void;
  onOpenTimeline: () => void;
  onOpenWindowById: (windowId: string) => void;
  onOpenExternal: (url: string) => void;
  dsHelperUrl: string;
};

function stop(e: MouseEvent) {
  e.stopPropagation();
}

const EXPANDED_FOLDER_APPS: { title: string; icon: ReactNode }[] = [
  { title: "Git Bash", icon: <SiGithub aria-hidden /> },
  { title: "Node.js", icon: <SiNodedotjs aria-hidden /> },
  { title: "Python 3.14 (64-bit)", icon: <SiPython aria-hidden /> },
  { title: "Developer PowerShell for VS 2022", icon: <TbBrandVscode aria-hidden /> },
  { title: "Docker Desktop", icon: <SiDocker aria-hidden /> },
  { title: "Visual Studio Installer", icon: <TbBrandVscode aria-hidden /> },
];

const RAIL_EXPAND_HOVER_MS = 500;

export const WindowsStartMenu = forwardRef<HTMLDivElement, WindowsStartMenuProps>(
  function WindowsStartMenu(
    { onClose, onOpenGitHub, onOpenTimeline, onOpenWindowById, onOpenExternal, dsHelperUrl },
    ref
  ) {
    const [recentExpanded, setRecentExpanded] = useState(false);
    const [creativeOpen, setCreativeOpen] = useState(false);
    const [railExpanded, setRailExpanded] = useState(false);

    const SCROLL_RAIL_LERP = 0.38;
    const SCROLL_WHEEL_LERP = 0.44;
    const SCROLL_WHEEL_DELTA = 0.72;

    const listScrollRef = useRef<HTMLDivElement>(null);
    const scrollRailRef = useRef<HTMLDivElement>(null);
    const scrollThumbRef = useRef<HTMLDivElement>(null);
    const smoothScrollRef = useRef({ target: 0, raf: 0, dragging: false });

    const updateThumbDom = useCallback(() => {
      const el = listScrollRef.current;
      const thumb = scrollThumbRef.current;
      const rail = scrollRailRef.current;
      if (!el || !thumb || !rail) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      const canScroll = scrollHeight > clientHeight + 1;
      rail.classList.toggle(styles.startMenuScrollRailHidden, !canScroll);

      if (!canScroll) {
        thumb.style.opacity = "0";
        return;
      }

      const trackH = rail.clientHeight;
      const thumbH = Math.max((clientHeight / scrollHeight) * trackH, 6);
      const maxScroll = scrollHeight - clientHeight;
      const top = maxScroll > 0 ? (scrollTop / maxScroll) * Math.max(0, trackH - thumbH) : 0;
      thumb.style.opacity = "1";
      thumb.style.height = `${thumbH}px`;
      thumb.style.transform = `translateY(${top}px)`;
    }, []);

    const stopSmoothScroll = useCallback(() => {
      const s = smoothScrollRef.current;
      if (s.raf) {
        cancelAnimationFrame(s.raf);
        s.raf = 0;
      }
    }, []);

    const tickSmoothScroll = useCallback(() => {
      const el = listScrollRef.current;
      const s = smoothScrollRef.current;
      if (!el) {
        s.raf = 0;
        return;
      }

      const max = el.scrollHeight - el.clientHeight;
      const target = Math.max(0, Math.min(max, s.target));
      const diff = target - el.scrollTop;

      if (Math.abs(diff) < 0.5) {
        el.scrollTop = target;
        s.raf = 0;
      } else {
        const lerp = s.dragging ? SCROLL_RAIL_LERP : SCROLL_WHEEL_LERP;
        el.scrollTop += diff * lerp;
        s.raf = requestAnimationFrame(tickSmoothScroll);
      }
      updateThumbDom();
    }, [updateThumbDom]);

    const setSmoothScrollTarget = useCallback(
      (target: number, dragging: boolean) => {
        const el = listScrollRef.current;
        if (!el) return;
        const max = el.scrollHeight - el.clientHeight;
        const s = smoothScrollRef.current;
        s.target = Math.max(0, Math.min(max, target));
        s.dragging = dragging;

        const reduceMotion =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduceMotion) {
          el.scrollTop = s.target;
          updateThumbDom();
          return;
        }

        if (!s.raf) {
          s.raf = requestAnimationFrame(tickSmoothScroll);
        }
      },
      [tickSmoothScroll, updateThumbDom]
    );

    const scrollTargetFromClientY = useCallback((clientY: number) => {
      const el = listScrollRef.current;
      const rail = scrollRailRef.current;
      if (!el || !rail) return 0;
      const rect = rail.getBoundingClientRect();
      const usableH = Math.max(1, rect.height);
      const y = Math.min(usableH, Math.max(0, clientY - rect.top));
      const ratio = y / usableH;
      const max = el.scrollHeight - el.clientHeight;
      return ratio * max;
    }, []);

    const onRailPointerDown = useCallback(
      (e: ReactPointerEvent<HTMLDivElement>) => {
        const el = listScrollRef.current;
        const rail = scrollRailRef.current;
        if (!el || !rail || el.scrollHeight <= el.clientHeight) return;
        rail.setPointerCapture(e.pointerId);
        rail.classList.add(styles.startMenuScrollRailDragging);

        const applyFromClientY = (clientY: number) => {
          setSmoothScrollTarget(scrollTargetFromClientY(clientY), true);
        };

        applyFromClientY(e.clientY);

        const onMove = (ev: globalThis.PointerEvent) => applyFromClientY(ev.clientY);
        const onUp = (ev: globalThis.PointerEvent) => {
          smoothScrollRef.current.dragging = false;
          rail.classList.remove(styles.startMenuScrollRailDragging);
          try {
            rail.releasePointerCapture(ev.pointerId);
          } catch {
            /* ignore */
          }
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
      },
      [scrollTargetFromClientY, setSmoothScrollTarget]
    );

    useLayoutEffect(() => {
      const el = listScrollRef.current;
      if (!el) return;

      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const onScroll = () => {
        updateThumbDom();
      };

      const onWheel = (ev: WheelEvent) => {
        if (el.scrollHeight <= el.clientHeight) return;
        ev.preventDefault();
        const s = smoothScrollRef.current;
        const base = s.raf ? s.target : el.scrollTop;
        setSmoothScrollTarget(base + ev.deltaY * SCROLL_WHEEL_DELTA, false);
      };

      el.addEventListener("scroll", onScroll, { passive: true });
      if (!reduceMotion) {
        el.addEventListener("wheel", onWheel, { passive: false });
      }

      const ro = new ResizeObserver(updateThumbDom);
      ro.observe(el);
      if (scrollRailRef.current) ro.observe(scrollRailRef.current);

      updateThumbDom();

      return () => {
        el.removeEventListener("scroll", onScroll);
        if (!reduceMotion) {
          el.removeEventListener("wheel", onWheel);
        }
        ro.disconnect();
        stopSmoothScroll();
      };
    }, [updateThumbDom, recentExpanded, creativeOpen, stopSmoothScroll, setSmoothScrollTarget]);

    const run = useCallback(
      (fn: () => void) => {
        fn();
        onClose();
      },
      [onClose]
    );

    const onKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") onClose();
      },
      [onClose]
    );

    const railExpandTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearRailExpandTimer = useCallback(() => {
      if (railExpandTimerRef.current !== null) {
        clearTimeout(railExpandTimerRef.current);
        railExpandTimerRef.current = null;
      }
    }, []);

    const scheduleOpenRail = useCallback(() => {
      clearRailExpandTimer();
      railExpandTimerRef.current = setTimeout(() => {
        railExpandTimerRef.current = null;
        setRailExpanded(true);
      }, RAIL_EXPAND_HOVER_MS);
    }, [clearRailExpandTimer]);

    const closeRail = useCallback(() => {
      clearRailExpandTimer();
      setRailExpanded(false);
    }, [clearRailExpandTimer]);

    useEffect(() => clearRailExpandTimer, [clearRailExpandTimer]);

    return (
      <div
        ref={ref}
        className={styles.startMenuRoot}
        role="dialog"
        aria-label="시작 메뉴"
        onMouseDown={stop}
        onKeyDown={onKeyDown}
      >
        <nav className={styles.startMenuBody} aria-label="앱 및 고정">
          <aside
            className={`${styles.startMenuRail} ${railExpanded ? styles.startMenuRailExpanded : ""}`}
            onMouseEnter={scheduleOpenRail}
            onMouseLeave={closeRail}
          >
            <div className={styles.startMenuRailTop}>
              <button
                type="button"
                className={styles.startMenuRailBtn}
                aria-label="시작"
                title="시작"
              >
                <span className={styles.startMenuRailBtnIcon} aria-hidden>
                  <IoMenuOutline size={18} strokeWidth={2.2} />
                </span>
                <span className={styles.startMenuRailLabel}>시작</span>
              </button>
            </div>
            <div className={styles.startMenuRailBottom}>
              <button
                type="button"
                className={`${styles.startMenuRailBtn} ${styles.startMenuRailBtnUser}`}
                aria-label="사용자"
                title="사용자"
              >
                <span className={styles.startMenuRailBtnIcon} aria-hidden>
                  <LiaUserSolid size={14} />
                </span>
                <span className={styles.startMenuRailLabel}>사용자</span>
              </button>
              <button type="button" className={styles.startMenuRailBtn} aria-label="문서" title="문서">
                <span className={styles.startMenuRailBtnIcon} aria-hidden>
                  <HiOutlineDocument size={16} />
                </span>
                <span className={styles.startMenuRailLabel}>문서</span>
              </button>
              <button type="button" className={styles.startMenuRailBtn} aria-label="사진" title="사진">
                <span className={styles.startMenuRailBtnIcon} aria-hidden>
                  <PiImage size={16} />
                </span>
                <span className={styles.startMenuRailLabel}>사진</span>
              </button>
              <button type="button" className={styles.startMenuRailBtn} aria-label="설정" title="설정">
                <span className={styles.startMenuRailBtnIcon} aria-hidden>
                  <CiSettings size={20} />
                </span>
                <span className={styles.startMenuRailLabel}>설정</span>
              </button>
              <button type="button" className={styles.startMenuRailBtn} aria-label="전원" title="전원">
                <span className={styles.startMenuRailBtnIcon} aria-hidden>
                  <TfiPowerOff size={15} />
                </span>
                <span className={styles.startMenuRailLabel}>전원</span>
              </button>
            </div>
          </aside>

          <div className={styles.startMenuMiddle}>
            <div className={styles.startMenuMiddleInner}>
              <div ref={listScrollRef} className={styles.startMenuListScroll}>
                <p className={styles.startMenuSectionLabel}>최근에 추가한 앱</p>

                <button
                  type="button"
                  className={styles.startMenuRow}
                  onClick={() => run(() => onOpenExternal(dsHelperUrl))}
                >
                  <span className={styles.startMenuIconWrap}>
                    <SiGooglechrome aria-hidden />
                  </span>
                  <span className={styles.startMenuRowBody}>
                    <span className={styles.startMenuRowTitle}>DS Helper</span>
                  </span>
                </button>
                <button type="button" className={styles.startMenuRow} onClick={() => run(onOpenGitHub)}>
                  <span className={styles.startMenuIconWrap}>
                    <SiGithub aria-hidden />
                  </span>
                  <span className={styles.startMenuRowBody}>
                    <span className={styles.startMenuRowTitle}>GitHub Desktop</span>
                  </span>
                </button>
                <button
                  type="button"
                  className={styles.startMenuRow}
                  onClick={() => run(() => onOpenWindowById("cursor"))}
                >
                  <span className={styles.startMenuIconWrap}>
                    <TbBrandVscode aria-hidden />
                  </span>
                  <span className={styles.startMenuRowBody}>
                    <span className={styles.startMenuRowTitle}>Antigravity</span>
                  </span>
                </button>

                <button
                  type="button"
                  className={styles.startMenuExpandRow}
                  aria-expanded={recentExpanded}
                  onClick={() => setRecentExpanded((v) => !v)}
                >
                  <span>확장</span>
                  <FiChevronDown
                    className={`${styles.startMenuExpandChevron} ${recentExpanded ? styles.startMenuExpandChevronOpen : ""}`}
                    aria-hidden
                  />
                </button>

                <div
                  className={`${styles.startMenuReveal} ${styles.startMenuRevealExpand} ${recentExpanded ? styles.startMenuRevealOpen : ""}`}
                  role="group"
                  aria-label="확장된 앱"
                  aria-hidden={!recentExpanded}
                >
                  <div className={styles.startMenuRevealInner}>
                    <div className={styles.startMenuExpandList}>
                      {EXPANDED_FOLDER_APPS.map((app) => (
                        <button
                          key={app.title}
                          type="button"
                          className={styles.startMenuRow}
                          aria-label={app.title}
                          tabIndex={recentExpanded ? 0 : -1}
                        >
                          <span className={styles.startMenuIconWrap}>{app.icon}</span>
                          <span className={styles.startMenuRowBody}>
                            <span className={styles.startMenuRowTitle}>{app.title}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <p className={styles.startMenuLetter}>#</p>
                <PlaceholderRow icon={<SiDiscord aria-hidden />} title="Discord" />

                <p className={styles.startMenuLetter}>A</p>
                <PlaceholderRow icon={<SiAndroidstudio aria-hidden />} title="Android Studio" />

                <p className={styles.startMenuLetter}>C</p>
                <button
                  type="button"
                  className={styles.startMenuRow}
                  onClick={() => run(() => onOpenWindowById("cursor"))}
                >
                  <span className={styles.startMenuIconWrap}>
                    <TbBrandVscode aria-hidden />
                  </span>
                  <span className={styles.startMenuRowBody}>
                    <span className={styles.startMenuRowTitle}>Cursor</span>
                    <span className={styles.startMenuRowSub}>새로 설치됨</span>
                  </span>
                </button>

                <button
                  type="button"
                  className={`${styles.startMenuRow} ${styles.startMenuRowFolder}`}
                  aria-expanded={creativeOpen}
                  onClick={() => setCreativeOpen((o) => !o)}
                >
                  <span className={styles.startMenuIconWrap} style={{ color: "#c9a227" }}>
                    <FaFolder aria-hidden />
                  </span>
                  <span className={styles.startMenuRowBody}>
                    <span className={styles.startMenuRowTitle}>Creative Cloud</span>
                  </span>
                  <FiChevronDown
                    className={`${styles.startMenuChevronEnd} ${creativeOpen ? styles.startMenuExpandChevronOpen : ""}`}
                    aria-hidden
                  />
                </button>
                <div
                  className={`${styles.startMenuReveal} ${styles.startMenuRevealFolder} ${creativeOpen ? styles.startMenuRevealOpen : ""}`}
                  aria-hidden={!creativeOpen}
                >
                  <div className={styles.startMenuRevealInner}>
                    <div className={styles.startMenuFolderChildren}>
                      <DecorRow icon={<MdOutlineRocketLaunch />} title="After Effects 2025" sub="시스템" muted />
                      <DecorRow icon={<MdOutlineRocketLaunch />} title="Photoshop 2025" sub="시스템" muted />
                    </div>
                  </div>
                </div>

                <p className={styles.startMenuLetter}>D</p>
                <PlaceholderRow icon={<SiDocker aria-hidden />} title="Docker Desktop" />

                <p className={styles.startMenuLetter}>G</p>
                <button
                  type="button"
                  className={styles.startMenuRow}
                  onClick={() => run(() => onOpenWindowById("projects"))}
                >
                  <span className={styles.startMenuIconWrap}>
                    <SiGooglechrome aria-hidden />
                  </span>
                  <span className={styles.startMenuRowBody}>
                    <span className={styles.startMenuRowTitle}>프로젝트</span>
                  </span>
                </button>

                <p className={styles.startMenuLetter}>K</p>
                <PlaceholderRow icon={<SiKakaotalk aria-hidden />} title="KakaoTalk" />

                <p className={styles.startMenuLetter}>T</p>
                <button type="button" className={styles.startMenuRow} onClick={() => run(onOpenTimeline)}>
                  <span className={styles.startMenuIconWrap}>
                    <FiFileText aria-hidden />
                  </span>
                  <span className={styles.startMenuRowBody}>
                    <span className={styles.startMenuRowTitle}>타임라인</span>
                    <span className={`${styles.startMenuRowSub} ${styles.startMenuRowSubMuted}`}>
                      포트폴리오
                    </span>
                  </span>
                </button>
              </div>
              <div
                ref={scrollRailRef}
                className={styles.startMenuScrollRail}
                onPointerDown={onRailPointerDown}
                role="presentation"
              >
                <div ref={scrollThumbRef} className={styles.startMenuScrollThumb} aria-hidden />
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
  }
);

function PlaceholderRow({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <button type="button" className={styles.startMenuRow} aria-label={title}>
      <span className={styles.startMenuIconWrap}>{icon}</span>
      <span className={styles.startMenuRowBody}>
        <span className={styles.startMenuRowTitle}>{title}</span>
      </span>
    </button>
  );
}

function DecorRow({ icon, title, sub, muted }: { icon: ReactNode; title: string; sub: string; muted?: boolean }) {
  return (
    <div className={styles.startMenuRow} style={{ pointerEvents: "none", opacity: 0.92 }}>
      <span className={styles.startMenuIconWrap}>{icon}</span>
      <span className={styles.startMenuRowBody}>
        <span className={styles.startMenuRowTitle}>{title}</span>
        <span className={`${styles.startMenuRowSub} ${muted ? styles.startMenuRowSubMuted : ""}`}>{sub}</span>
      </span>
    </div>
  );
}
