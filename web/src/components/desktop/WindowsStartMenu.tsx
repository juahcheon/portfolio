"use client";

import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  FiChevronDown,
  FiFileText,
  FiImage,
  FiMenu,
  FiPower,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import {
  SiAndroidstudio,
  SiDiscord,
  SiDocker,
  SiGithub,
  SiGooglechrome,
  SiKakaotalk,
} from "react-icons/si";
import {
  TbBrandEdge,
  TbBrandLinkedin,
  TbBrandVscode,
  TbCalculator,
  TbShoppingBag,
} from "react-icons/tb";
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

export const WindowsStartMenu = forwardRef<HTMLDivElement, WindowsStartMenuProps>(
  function WindowsStartMenu(
    { onClose, onOpenGitHub, onOpenTimeline, onOpenWindowById, onOpenExternal, dsHelperUrl },
    ref
  ) {
    const [recentExpanded, setRecentExpanded] = useState(true);
    const [creativeOpen, setCreativeOpen] = useState(false);

    const listScrollRef = useRef<HTMLDivElement>(null);
    const scrollRailRef = useRef<HTMLDivElement>(null);
    const scrollThumbRef = useRef<HTMLDivElement>(null);

    const updateThumbDom = useCallback(() => {
      const el = listScrollRef.current;
      const thumb = scrollThumbRef.current;
      const rail = scrollRailRef.current;
      if (!el || !thumb || !rail) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      const trackH = rail.clientHeight;
      if (scrollHeight <= clientHeight + 1) {
        thumb.style.opacity = "0";
        thumb.style.pointerEvents = "none";
        return;
      }
      const thumbH = Math.max((clientHeight / scrollHeight) * trackH, 10);
      const maxScroll = scrollHeight - clientHeight;
      const top = maxScroll > 0 ? (scrollTop / maxScroll) * Math.max(0, trackH - thumbH) : 0;
      thumb.style.opacity = "1";
      thumb.style.pointerEvents = "none";
      thumb.style.height = `${thumbH}px`;
      thumb.style.transform = `translateY(${top}px)`;
    }, []);

    const onRailPointerDown = useCallback(
      (e: PointerEvent<HTMLDivElement>) => {
        const el = listScrollRef.current;
        const rail = scrollRailRef.current;
        if (!el || !rail || el.scrollHeight <= el.clientHeight) return;
        rail.setPointerCapture(e.pointerId);

        const applyFromClientY = (clientY: number) => {
          const rect = rail.getBoundingClientRect();
          const ratio = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
          const max = el.scrollHeight - el.clientHeight;
          el.scrollTop = ratio * max;
          updateThumbDom();
        };

        applyFromClientY(e.clientY);

        const onMove = (ev: PointerEvent) => applyFromClientY(ev.clientY);
        const onUp = (ev: PointerEvent) => {
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
      [updateThumbDom]
    );

    useLayoutEffect(() => {
      const el = listScrollRef.current;
      if (!el) return;

      let rafId = 0;
      const activeSmooth = { current: false };
      const target = { current: el.scrollTop };
      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const tick = () => {
        activeSmooth.current = true;
        const diff = target.current - el.scrollTop;
        if (Math.abs(diff) < 0.4) {
          el.scrollTop = target.current;
          activeSmooth.current = false;
          rafId = 0;
          updateThumbDom();
          return;
        }
        el.scrollTop += diff * 0.22;
        rafId = requestAnimationFrame(tick);
        updateThumbDom();
      };

      const onScroll = () => {
        if (!activeSmooth.current) {
          target.current = el.scrollTop;
        }
        updateThumbDom();
      };

      const onWheel = (ev: WheelEvent) => {
        if (el.scrollHeight <= el.clientHeight) return;
        ev.preventDefault();
        const max = el.scrollHeight - el.clientHeight;
        target.current = Math.max(0, Math.min(max, target.current + ev.deltaY));
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(tick);
      };

      el.addEventListener("scroll", onScroll, { passive: true });
      if (!reduceMotion) {
        el.addEventListener("wheel", onWheel, { passive: false });
      }

      const ro = new ResizeObserver(updateThumbDom);
      ro.observe(el);
      if (scrollRailRef.current) ro.observe(scrollRailRef.current);

      target.current = el.scrollTop;
      updateThumbDom();

      return () => {
        cancelAnimationFrame(rafId);
        el.removeEventListener("scroll", onScroll);
        if (!reduceMotion) {
          el.removeEventListener("wheel", onWheel);
        }
        ro.disconnect();
      };
    }, [updateThumbDom, recentExpanded, creativeOpen]);

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
          <aside className={styles.startMenuRail}>
            <div className={styles.startMenuRailTop}>
              <button type="button" className={styles.startMenuRailBtn} aria-label="메뉴" title="메뉴">
                <FiMenu size={18} strokeWidth={2.2} />
              </button>
            </div>
            <div className={styles.startMenuRailBottom}>
              <button type="button" className={styles.startMenuRailBtn} aria-label="사용자 계정" title="계정">
                <FiUser size={17} />
              </button>
              <button type="button" className={styles.startMenuRailBtn} aria-label="문서" title="문서">
                <FiFileText size={16} />
              </button>
              <button type="button" className={styles.startMenuRailBtn} aria-label="사진" title="사진">
                <FiImage size={16} />
              </button>
              <button type="button" className={styles.startMenuRailBtn} aria-label="설정" title="설정">
                <FiSettings size={17} />
              </button>
              <button type="button" className={styles.startMenuRailBtn} aria-label="전원" title="전원">
                <FiPower size={16} />
              </button>
            </div>
          </aside>

          <div className={styles.startMenuMiddle}>
            <div className={styles.startMenuMiddleScrollWrap}>
              <div ref={listScrollRef} className={styles.startMenuListScroll}>
              <p className={styles.startMenuSectionLabel}>최근에 추가한 앱</p>

              {recentExpanded ? (
                <>
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
                </>
              ) : null}

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

              <div className={styles.startMenuDivider} />

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
              {creativeOpen ? (
                <div className={styles.startMenuFolderChildren}>
                  <DecorRow icon={<MdOutlineRocketLaunch />} title="After Effects 2025" sub="시스템" muted />
                  <DecorRow icon={<MdOutlineRocketLaunch />} title="Photoshop 2025" sub="시스템" muted />
                </div>
              ) : null}

              <p className={styles.startMenuLetter}>D</p>
              <PlaceholderRow icon={<SiDocker aria-hidden />} title="Docker Desktop" />

              <p className={styles.startMenuLetter}>G</p>
              <button
                type="button"
                className={styles.startMenuRow}
                onClick={() => run(() => onOpenWindowById("chrome"))}
              >
                <span className={styles.startMenuIconWrap}>
                  <SiGooglechrome aria-hidden />
                </span>
                <span className={styles.startMenuRowBody}>
                  <span className={styles.startMenuRowTitle}>Google Chrome</span>
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
                  <span className={`${styles.startMenuRowSub} ${styles.startMenuRowSubMuted}`}>포트폴리오</span>
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
