"use client";

import Link from "next/link";
import Image from "next/image";
import { FaThumbtack } from "react-icons/fa6";

const favorites = [
  { label: "바탕 화면", pin: true },
  { label: "다운로드", pin: true },
  { label: "문서", pin: true },
  { label: "사진", pin: true },
  { label: ".claude", pin: false },
  { label: "01_banchan", pin: false },
  { label: "project", pin: false },
  { label: "매력일자리", pin: false },
];

/** 라이브러리 폴더는 전용 아이콘, 나머지 즐겨찾기는 공용 폴더 PNG */
const favoriteIconSrcByLabel: Record<string, string> = {
  "바탕 화면": "/icons/explore/desktopIcon.png",
  다운로드: "/icons/explore/downloadIcon.png",
  문서: "/icons/explore/documentIcon.png",
  사진: "/icons/explore/imageIcon.png",
};

function favoriteIconSrc(label: string) {
  return favoriteIconSrcByLabel[label] ?? "/icons/explore/folderIcon.png";
}

type Props = {
  /** 내 PC 창일 때 사이드바에서 '내 PC' 항목 선택 표시 */
  thisPcSelected?: boolean;
};

export function ExplorerSidebar({ thisPcSelected = false }: Props) {
  return (
    <nav
      className="w-[168px] shrink-0 overflow-x-hidden overflow-y-auto border-r border-[#d9d9d9] py-2 pb-3 pl-0 pr-0 font-[Segoe_UI,Malgun_Gothic,system-ui,sans-serif] text-xs text-black"
      aria-label="탐색기 내비게이션"
    >
      <div className="flex items-center gap-1.5 py-1 pl-3.5 pr-3 font-normal text-black">
        <Image src="/icons/explore/bookmarkIcon.png" alt="즐겨찾기" width={16} height={16} />
        <span>즐겨찾기</span>
      </div>
      {favorites.map((item) => (
        <div
          key={item.label}
          className="flex min-h-[22px] cursor-pointer items-center gap-2 py-0.5 pl-7 pr-3 text-black hover:bg-[#e5f3ff] "
        >
          <span className="flex shrink-0 items-center justify-center">
            <Image src={favoriteIconSrc(item.label)} alt="" width={16} height={16} className="select-none" draggable={false} />
          </span>
          <span>{item.label}</span>
          {item.pin ? (
            <FaThumbtack className="ml-auto rotate-45 text-[8px] opacity-45" aria-hidden />
          ) : null}
        </div>
      ))}

      <Link
        href="/"
        className={`flex min-h-[22px] cursor-default items-center gap-2 py-0.5 pl-7 pr-3 mt-3 mb-2 text-black no-underline hover:bg-[#cce8ff] focus-visible:outline focus-visible:outline-1 focus-visible:outline-dotted focus-visible:outline-black focus-visible:outline-offset-[-2px] ${
          thisPcSelected ? "bg-[#d9d9d9] hover:bg-[#e5f3ff]" : ""
        }`}
        title="포트폴리오 바탕화면으로 이동"
      >
        <Image src="/icons/explore/myPcIcon.png" alt="내 PC" width={16} height={16} />
        <span>내 PC</span>
      </Link>

      <div className="flex min-h-[22px] cursor-pointer items-center gap-2 py-0.5 pl-7 pr-3 text-black hover:bg-[#e5f3ff]">
        <Image src="/icons/explore/networkIcon.png" alt="네트워크" width={16} height={16} />
        <span>네트워크</span>
      </div>
    </nav>
  );
}
