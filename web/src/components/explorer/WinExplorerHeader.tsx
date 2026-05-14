"use client";

import Image from "next/image";

type Props = {
  title: string;
  /** 데스크톱에서 연 창과 동일한 아이콘 URL (있으면 leading·기본 폴더보다 우선) */
  titleIconUrl?: string;
  leading?: React.ReactNode;
  maximized: boolean;
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

function IconRestore() {
  return (
    <span className="pointer-events-none relative block h-2.5 w-2.5">
      <span className="absolute left-0 top-0.5 box-border h-1.5 w-[7px] border border-current" />
      <span className="absolute bottom-0.5 right-0 box-border h-1.5 w-[7px] border border-current bg-white" />
    </span>
  );
}

function IconClose() {
  return (
    <span className="pointer-events-none relative block h-2.5 w-2.5">
      <span className="absolute left-1/2 top-1/2 h-px w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
      <span className="absolute left-1/2 top-1/2 h-px w-2.5 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
    </span>
  );
}

export function WinExplorerHeader({
  title,
  titleIconUrl,
  leading,
  maximized,
  onMinimize,
  onMaximize,
  onClose,
}: Props) {
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

  return (
    <header
      className="flex h-[30px] shrink-0 cursor-default select-none items-center border-b border-[#e5e5e5] bg-white py-0 pl-1.5 pr-0.5 font-[Segoe_UI,Malgun_Gothic,system-ui,sans-serif]"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden pr-1 text-xs font-normal text-black">
        {icon}
        <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{title}</span>
      </div>
      <div className="-mr-0.5 flex h-full items-stretch">
        <button
          type="button"
          className="flex min-w-[45px] cursor-default items-center justify-center border-0 bg-transparent px-0 text-black hover:bg-[#e5e5e5] active:bg-[#ccc]"
          aria-label="최소화"
          onClick={onMinimize}
        >
          <IconMin />
        </button>
        <button
          type="button"
          className="flex min-w-[45px] cursor-default items-center justify-center border-0 bg-transparent px-0 text-black hover:bg-[#e5e5e5] active:bg-[#ccc]"
          aria-label={maximized ? "이전 크기로" : "최대화"}
          onClick={onMaximize}
        >
          {maximized ? <IconRestore /> : <IconMax />}
        </button>
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
