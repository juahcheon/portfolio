"use client";

import {
  forwardRef,
  useCallback,
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
import { TbBrandVscode } from "react-icons/tb";
import { FaFolder } from "react-icons/fa";
import { MdOutlineRocketLaunch } from "react-icons/md";

export type WindowsStartMenuProps = {
  onClose: () => void;
  onOpenGitHub: () => void;
  onOpenTimeline: () => void;
  onOpenWindowById: (windowId: string) => void;
  onOpenExternal: (url: string) => void;
  dsHelperUrl: string;
};

const startMenuRoot =
  "fixed bottom-[49px] left-0 z-50 box-border flex h-[80%] flex-col overflow-hidden border border-black/[0.14] bg-[linear-gradient(105deg,rgba(228,246,216,0.82)_0%,rgba(232,248,236,0.88)_35%,rgba(220,240,248,0.86)_100%)] font-['Segoe_UI','Malgun_Gothic',system-ui,sans-serif] shadow-startMenu backdrop-blur-[40px] backdrop-saturate-[1.15] animate-startMenuSlideUp motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none";

const railBtn =
  "flex h-9 w-9 items-center justify-center rounded-[3px] border-0 bg-transparent text-[#1a1a1a] transition-colors hover:bg-white/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgba(0,120,212,0.6)] focus-visible:outline-offset-px";

const rowBtn =
  "flex w-full items-center gap-2.5 rounded-[3px] border-0 bg-transparent p-[5px_8px] text-left font-[inherit] text-[#111] transition-colors hover:bg-white/48 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgba(0,120,212,0.55)] focus-visible:outline-offset-0";

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
      (e: ReactPointerEvent<HTMLDivElement>) => {
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

        const onMove = (ev: globalThis.PointerEvent) => applyFromClientY(ev.clientY);
        const onUp = (ev: globalThis.PointerEvent) => {
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
        className={startMenuRoot}
        role="dialog"
        aria-label="시작 메뉴"
        onMouseDown={stop}
        onKeyDown={onKeyDown}
      >
        <nav className="flex min-h-0 flex-1 flex-row overflow-hidden" aria-label="앱 및 고정">
          <aside className="flex w-10 shrink-0 flex-col items-center border-r border-black/[0.06] bg-white/[0.22] py-2.5 pb-3">
            <div className="flex shrink-0 justify-center">
              <button type="button" className={railBtn} aria-label="메뉴" title="메뉴">
                <FiMenu size={18} strokeWidth={2.2} />
              </button>
            </div>
            <div className="mt-auto flex flex-col items-center gap-px pt-2.5">
              <button type="button" className={railBtn} aria-label="사용자 계정" title="계정">
                <FiUser size={17} />
              </button>
              <button type="button" className={railBtn} aria-label="문서" title="문서">
                <FiFileText size={16} />
              </button>
              <button type="button" className={railBtn} aria-label="사진" title="사진">
                <FiImage size={16} />
              </button>
              <button type="button" className={railBtn} aria-label="설정" title="설정">
                <FiSettings size={17} />
              </button>
              <button type="button" className={railBtn} aria-label="전원" title="전원">
                <FiPower size={16} />
              </button>
            </div>
          </aside>

          <div className="flex w-1/2 min-w-[248px] shrink-0 flex-col border-r border-black/[0.08] bg-white/[0.12]">
            <div className="relative flex min-h-0 flex-1 flex-col">
              <div
                ref={listScrollRef}
                className="startMenuListScroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-3.5 pb-5 pl-4 pt-[18px] [contain:layout] [scroll-behavior:smooth] [transform:translateZ(0)]"
              >
                <p className="mb-2 px-0.5 text-[11px] font-semibold tracking-[0.01em] text-[#2d2d2d]">
                  최근에 추가한 앱
                </p>

                {recentExpanded ? (
                  <>
                    <button
                      type="button"
                      className={rowBtn}
                      onClick={() => run(() => onOpenExternal(dsHelperUrl))}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center text-lg text-[#222]">
                        <SiGooglechrome aria-hidden />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-px">
                        <span className="text-[13px] leading-[1.28] text-[#111]">DS Helper</span>
                      </span>
                    </button>
                    <button type="button" className={rowBtn} onClick={() => run(onOpenGitHub)}>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center text-lg text-[#222]">
                        <SiGithub aria-hidden />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-px">
                        <span className="text-[13px] leading-[1.28] text-[#111]">GitHub Desktop</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      className={rowBtn}
                      onClick={() => run(() => onOpenWindowById("cursor"))}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center text-lg text-[#222]">
                        <TbBrandVscode aria-hidden />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-px">
                        <span className="text-[13px] leading-[1.28] text-[#111]">Antigravity</span>
                      </span>
                    </button>
                  </>
                ) : null}

                <button
                  type="button"
                  className="mb-2.5 mt-1 flex w-full items-center justify-between rounded-[3px] border-0 bg-transparent p-1.5 px-2 font-[inherit] text-xs text-[#1a1a1a] transition-colors hover:bg-white/[0.42]"
                  aria-expanded={recentExpanded}
                  onClick={() => setRecentExpanded((v) => !v)}
                >
                  <span>확장</span>
                  <FiChevronDown
                    className={`text-[13px] text-[#555] transition-transform duration-150 ${recentExpanded ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>

                <div className="my-2.5 mb-3 h-px bg-black/[0.08]" />

                <p className="mb-[5px] mt-3 px-0.5 text-[11px] font-bold text-[#5c5c5c]">#</p>
                <PlaceholderRow icon={<SiDiscord aria-hidden />} title="Discord" />

                <p className="mb-[5px] mt-3 px-0.5 text-[11px] font-bold text-[#5c5c5c]">A</p>
                <PlaceholderRow icon={<SiAndroidstudio aria-hidden />} title="Android Studio" />

                <p className="mb-[5px] mt-3 px-0.5 text-[11px] font-bold text-[#5c5c5c]">C</p>
                <button
                  type="button"
                  className={rowBtn}
                  onClick={() => run(() => onOpenWindowById("cursor"))}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center text-lg text-[#222]">
                    <TbBrandVscode aria-hidden />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-px">
                    <span className="text-[13px] leading-[1.28] text-[#111]">Cursor</span>
                    <span className="text-[11px] leading-[1.2] text-[#0b57d0]">새로 설치됨</span>
                  </span>
                </button>

                <button
                  type="button"
                  className={`${rowBtn} cursor-pointer`}
                  aria-expanded={creativeOpen}
                  onClick={() => setCreativeOpen((o) => !o)}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center text-lg text-[#c9a227]">
                    <FaFolder aria-hidden />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-px">
                    <span className="text-[13px] leading-[1.28] text-[#111]">Creative Cloud</span>
                  </span>
                  <FiChevronDown
                    className={`ml-auto shrink-0 text-[13px] text-[#666] transition-transform duration-150 ${creativeOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                {creativeOpen ? (
                  <div className="mb-1.5 ml-3 mt-0.5 border-l border-black/10 pl-2.5">
                    <DecorRow icon={<MdOutlineRocketLaunch />} title="After Effects 2025" sub="시스템" muted />
                    <DecorRow icon={<MdOutlineRocketLaunch />} title="Photoshop 2025" sub="시스템" muted />
                  </div>
                ) : null}

                <p className="mb-[5px] mt-3 px-0.5 text-[11px] font-bold text-[#5c5c5c]">D</p>
                <PlaceholderRow icon={<SiDocker aria-hidden />} title="Docker Desktop" />

                <p className="mb-[5px] mt-3 px-0.5 text-[11px] font-bold text-[#5c5c5c]">G</p>
                <button
                  type="button"
                  className={rowBtn}
                  onClick={() => run(() => onOpenWindowById("chrome"))}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center text-lg text-[#222]">
                    <SiGooglechrome aria-hidden />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-px">
                    <span className="text-[13px] leading-[1.28] text-[#111]">Google Chrome</span>
                  </span>
                </button>

                <p className="mb-[5px] mt-3 px-0.5 text-[11px] font-bold text-[#5c5c5c]">K</p>
                <PlaceholderRow icon={<SiKakaotalk aria-hidden />} title="KakaoTalk" />

                <p className="mb-[5px] mt-3 px-0.5 text-[11px] font-bold text-[#5c5c5c]">T</p>
                <button type="button" className={rowBtn} onClick={() => run(onOpenTimeline)}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center text-lg text-[#222]">
                    <FiFileText aria-hidden />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-px">
                    <span className="text-[13px] leading-[1.28] text-[#111]">타임라인</span>
                    <span className="text-[11px] leading-[1.2] text-[#5f6368]">포트폴리오</span>
                  </span>
                </button>
              </div>
              <div
                ref={scrollRailRef}
                className="absolute bottom-0 right-0 top-0 z-10 w-1.5 cursor-default"
                onPointerDown={onRailPointerDown}
                role="presentation"
              >
                <div
                  ref={scrollThumbRef}
                  className="absolute left-0 right-0 rounded-sm bg-black/30"
                  aria-hidden
                />
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
    <button type="button" className={rowBtn} aria-label={title}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center text-lg text-[#222]">{icon}</span>
      <span className="flex min-w-0 flex-1 flex-col gap-px">
        <span className="text-[13px] leading-[1.28] text-[#111]">{title}</span>
      </span>
    </button>
  );
}

function DecorRow({ icon, title, sub, muted }: { icon: ReactNode; title: string; sub: string; muted?: boolean }) {
  return (
    <div className={rowBtn} style={{ pointerEvents: "none", opacity: 0.92 }}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center text-lg text-[#222]">{icon}</span>
      <span className="flex min-w-0 flex-1 flex-col gap-px">
        <span className="text-[13px] leading-[1.28] text-[#111]">{title}</span>
        <span className={`text-[11px] leading-[1.2] ${muted ? "text-[#5f6368]" : "text-[#0b57d0]"}`}>{sub}</span>
      </span>
    </div>
  );
}
