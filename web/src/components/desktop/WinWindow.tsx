"use client";

import type { OpenWindow } from "@/store/desktopStore";
import type { PortfolioPayload } from "@/types/portfolio";
import { ChromeLegacyModal } from "./ChromeLegacyModal";
import { WindowContents } from "./WindowContents";

type Props = {
  win: OpenWindow;
  data: PortfolioPayload;
  zIndex: number;
  offset: { left: number; top: number };
  isActive: boolean;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
};

export function WinWindow({
  win,
  data,
  zIndex,
  offset,
  isActive,
  onClose,
  onFocus,
}: Props) {
  if (win.kind === "chrome" && win.iframeUrl) {
    return (
      <ChromeLegacyModal
        zIndex={zIndex}
        iframeUrl={win.iframeUrl}
        onClose={() => onClose(win.id)}
        onFocus={() => onFocus(win.id)}
      />
    );
  }

  const ring = isActive ? "ring-2 ring-amber-300/90" : "";

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={win.title}
      onMouseDown={() => onFocus(win.id)}
      className={`absolute flex w-[min(92vw,760px)] flex-col overflow-hidden rounded-t-md border border-neutral-400 bg-white shadow-win ${ring}`}
      style={{
        zIndex,
        left: offset.left,
        top: offset.top,
        height: "min(78vh, 640px, calc(100vh - 70px))",
      }}
    >
      <header className="flex h-9 shrink-0 cursor-default select-none items-center gap-2 bg-winBlue px-2 text-white">
        <span className="flex-1 truncate text-sm font-medium">{win.title}</span>
        <button
          type="button"
          aria-label="닫기"
          className="flex h-7 w-7 items-center justify-center rounded hover:bg-white/20"
          onClick={(e) => {
            e.stopPropagation();
            onClose(win.id);
          }}
        >
          ×
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-auto p-4 text-sm">
        <WindowContents win={win} data={data} />
      </div>
    </div>
  );
}
