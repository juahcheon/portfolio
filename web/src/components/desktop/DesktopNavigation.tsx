"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FaChevronRight, FaCompass, FaXmark } from "react-icons/fa6";
import type { Desktop } from "@/types/portfolio";

type Props = {
  guide: NonNullable<Desktop["exploreGuide"]>;
  icons: Desktop["icons"];
  onOpenWindow: (windowId: string) => void;
  mobile?: boolean;
  onExpand?: () => void;
};

export function DesktopNavigation({ guide, icons, onOpenWindow, mobile = false, onExpand }: Props) {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!expanded) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) setExpanded(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [expanded]);

  function closeAndFocus() {
    setExpanded(false);
    toggleRef.current?.focus();
  }

  return (
    <div
      ref={containerRef}
      className={mobile ? "relative flex shrink-0 items-center" : "fixed bottom-[66px] right-4 z-[95] flex flex-col-reverse items-end gap-3"}
      onClick={(event) => event.stopPropagation()}
      onPointerEnter={(event) => { if (!mobile && event.pointerType === "mouse") setExpanded(true); }}
      onPointerLeave={(event) => {
        if (!mobile && event.pointerType === "mouse" && !event.currentTarget.contains(document.activeElement)) setExpanded(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setExpanded(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && expanded) {
          event.preventDefault();
          event.stopPropagation();
          closeAndFocus();
        }
      }}
    >
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        aria-label={guide.buttonLabel}
        onClick={() => { if (!expanded) onExpand?.(); setExpanded((value) => !value); }}
        className={mobile ? "flex h-11 w-11 items-center justify-center rounded text-xl text-[#2b579a] focus-visible:outline" : "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-white/70 bg-[#2b579a] px-4 py-2.5 text-[14px] font-semibold text-white shadow-lg hover:bg-[#244a83] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b579a]"}
      >
        {expanded ? <FaXmark aria-hidden /> : <FaCompass aria-hidden />}
        {!mobile && guide.buttonLabel}
      </button>

      {expanded ? (
        <nav id={panelId} aria-label={guide.title} className={`${mobile ? "absolute bottom-[52px] right-0 max-h-[calc(var(--desktop-height)-var(--mobile-bar-height)-32px)]" : "max-h-[calc(100dvh-140px)]"} w-[400px] max-w-[calc(100vw-32px)] overflow-y-auto rounded-lg border border-[#d1d9e0] bg-white p-4 text-[#202124] shadow-xl`}>
          <h2 className="m-0 mb-3 text-[18px] font-bold">{guide.title}</h2>
          <ul className="m-0 list-none divide-y divide-[#e8eaed] p-0">
            {guide.items.map((item) => {
              const icon = icons.find((entry) => entry.windowId === item.windowId);
              return (
                <li key={item.windowId}>
                  <button
                    type="button"
                    onClick={() => { onOpenWindow(item.windowId); closeAndFocus(); }}
                    className="flex min-h-16 w-full cursor-pointer items-center gap-3 rounded-md px-2 py-4 text-left hover:bg-[#f0f4fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2b579a]"
                  >
                    {icon ? <img src={icon.imageUrl} alt="" width={24} height={24} className="h-6 w-6 shrink-0 object-contain" /> : null}
                    <span className="min-w-0 flex-1 text-[16px] font-semibold">{item.title}</span>
                    <FaChevronRight className="shrink-0 text-[14px] text-[#5f6368]" aria-hidden />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
