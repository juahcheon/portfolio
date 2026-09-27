"use client";

import Image from "next/image";
import { FaChevronLeft } from "react-icons/fa6";
import { useDesktopStore } from "@/store/desktopStore";
import { WindowRestoreIcon } from "@/components/icons/WindowRestoreIcon";

export type WinFrameTitleBarProps = {
  mobile?: boolean;
  compact?: boolean;
  title: string;
  titleIconUrl?: string;
  leading?: React.ReactNode;
  maximized: boolean;
  onTitleBarPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
};

function IconMin() {
  return <span className="pointer-events-none block h-px w-2.5 bg-current" />;
}

function IconMax() {
  return <span className="pointer-events-none box-border block h-2.5 w-2.5 border border-current" />;
}

function IconClose() {
  return (
    <svg className="pointer-events-none h-2.5 w-2.5" viewBox="0 0 10 10" fill="none" stroke="currentColor" aria-hidden>
      <path d="m.5.5 9 9m0-9-9 9" />
    </svg>
  );
}

/** 모든 데스크톱 창 공통 — Windows 스타일 흰색 타이틀 바(아이콘·제목·최소화·최대/복원·닫기) */
export function WinFrameTitleBar({
  title,
  titleIconUrl,
  leading,
  maximized,
  onTitleBarPointerDown,
  onMinimize,
  onMaximize,
  onClose,
  mobile = false,
  compact = false,
}: WinFrameTitleBarProps) {
  const minimizeAll = useDesktopStore((s) => s.minimizeAll);
  const icon =
    titleIconUrl != null && titleIconUrl !== "" ? (
      <Image
        src={titleIconUrl}
        alt=""
        width={16}
        height={16}
        className="shrink-0 object-contain"
        unoptimized
      />
    ) : leading != null ? (
      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center">{leading}</span>
    ) : (
      <Image
        src="/icons/explore/folderIcon.png"
        alt=""
        width={16}
        height={16}
        className="shrink-0 object-contain"
        unoptimized
      />
    );

  if (mobile) {
    return (
      <header className="grid h-16 shrink-0 grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-2 bg-[#f7f8fb] px-4 text-[#202124]">
        <button type="button" aria-label="홈으로 돌아가기" onClick={minimizeAll} className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white text-[13px] font-medium active:bg-black/5 focus-visible:outline">
          <FaChevronLeft className="text-sm" aria-hidden />
        </button>
        <span className="truncate text-center text-base font-semibold">{title}</span>
        <span className="justify-self-end rounded-full bg-white p-3" aria-hidden>{icon}</span>
      </header>
    );
  }

  return (
    <header
      className={`window-title-bar flex ${mobile || compact ? "h-11" : "h-[30px]"} shrink-0 cursor-default select-none items-center bg-white py-0 pl-1.5 pr-0.5 font-[Segoe_UI,Malgun_Gothic,system-ui,sans-serif]`}
      onDoubleClick={(event) => {
        if (mobile || (event.target as Element).closest("button")) return;
        event.preventDefault();
        event.stopPropagation();
        onMaximize();
      }}
    >
      <div
        className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden pr-1 text-[13px] font-normal text-black"
        onPointerDown={mobile ? undefined : onTitleBarPointerDown}
      >
        {icon}
        <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{title}</span>
      </div>
      <div className={`window-title-actions -mr-0.5 flex ${mobile || compact ? "h-11" : "h-[29px]"} items-stretch gap-px self-start`}>
        <button
          type="button"
          className="flex min-w-[45px] cursor-default items-center justify-center border-0 bg-transparent px-0 text-black hover:bg-[#e5e5e5] active:bg-[#ccc]"
          aria-label="최소화"
          onClick={onMinimize}
        >
          <IconMin />
        </button>
        {!mobile && <button
          type="button"
          className="flex min-w-[45px] cursor-default items-center justify-center border-0 bg-transparent px-0 text-black [--window-restore-front-fill:#ffffff] hover:bg-[#e5e5e5] hover:[--window-restore-front-fill:#e5e5e5] active:bg-[#ccc]"
          aria-label={maximized ? "이전 크기로" : "최대화"}
          onClick={onMaximize}
        >
          {maximized ? <WindowRestoreIcon /> : <IconMax />}
        </button>}
        <button
          type="button"
          className="flex min-w-[45px] cursor-default items-center justify-center border-0 bg-transparent px-0 text-black hover:bg-[#e81123] hover:text-white active:bg-[#941010] active:text-white"
          aria-label="닫기"
          onClick={onClose}
        >
          <IconClose />
        </button>
      </div>
    </header>
  );
}
