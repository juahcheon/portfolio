"use client";

import Image from "next/image";
import {
  exAddressBox,
  exAddressCrumb,
  exCommandBar,
  exListPane,
  exMainRow,
  exNavBtn,
  exNavCluster,
  exRefreshBtn,
  exSearchInput,
  exSearchMag,
  exSearchWrap,
  exShell,
  exStatusBar,
  exStatusIconBtn,
  exStatusRight,
  exTableScroll,
} from "./explorerShellClasses";
import { ExplorerFolderIcon } from "./ExplorerFolderIcon";
import { ExplorerSidebar } from "./ExplorerSidebar";

const folders = [
  "3D 개체",
  "다운로드",
  "동영상",
  "문서",
  "바탕 화면",
  "사진",
  "음악",
];

/** 특수 폴더: 본체 폴더 아이콘 우측 하단 배지 */
const folderCornerBadgeByName: Record<string, string> = {
  문서: "/icons/sidebar/documentIcon.png",
  "바탕 화면": "/icons/sidebar/desktopIcon.png",
  사진: "/icons/sidebar/imageIcon.png",
};

/** 섹션 제목 행: 제목 오른쪽 5px 뒤 #ddd 구분선이 남은 너비까지 */
const thisPcSectionHeaderRow =
  "mb-2.5 flex w-full min-w-0 cursor-default items-center text-xs font-normal text-[#3190c5]";

const drives = [
  { label: "로컬 디스크 (C:)", meta: "207GB 중 120GB 사용 가능", pct: 42, showWin: true },
  { label: "새 볼륨 (D:)", meta: "24.8GB 중 15.7GB 사용 가능", pct: 37, showWin: false },
];

/** 폴더·드라이브 행 공통: 아이콘 왼쪽, 텍스트 오른쪽 */
const thisPcItemRow =
  "flex w-[200px] shrink-0 cursor-default flex-row items-start rounded-sm gap-1 px-1.5 py-1.5 text-left hover:bg-[#e5f3ff]";

export function ThisPcExplorerView() {
  return (
    <div className={exShell}>
      <div className={exCommandBar}>
        <div className={exNavCluster}>
          <button type="button" className={exNavBtn} aria-label="뒤로" title="뒤로">
            <i className="fa-solid fa-arrow-left" />
          </button>
          <button type="button" className={exNavBtn} aria-label="앞으로" title="앞으로">
            <i className="fa-solid fa-arrow-right" />
          </button>
          <button type="button" className={exNavBtn} aria-label="상위 폴더" title="상위 폴더">
            <i className="fa-solid fa-arrow-up" />
          </button>
        </div>
        <div className={exAddressBox}>
          <i className="fa-solid fa-desktop text-xs text-[#606060]" aria-hidden />
          <span className={exAddressCrumb}>&gt; 내 PC</span>
        </div>
        <button type="button" className={exRefreshBtn} aria-label="새로 고침">
          <i className="fa-solid fa-rotate-right" />
        </button>
        <div className={exSearchWrap}>
          <input className={exSearchInput} type="search" placeholder="내 PC 검색" readOnly aria-readonly />
          <i className={`fa-solid fa-magnifying-glass ${exSearchMag}`} aria-hidden />
        </div>
      </div>

      <div className={exMainRow}>
        <ExplorerSidebar thisPcSelected />
        <div className={exListPane}>
          <div className={exTableScroll}>
            <div className="px-3 pb-3 pt-2">
              <div className={thisPcSectionHeaderRow}>
                <i className="fa-solid fa-chevron-down mr-1.5 shrink-0 text-[8px] text-[#3190c5]" aria-hidden />
                <span className="shrink-0">폴더 (7)</span>
                <div className="ml-[5px] h-px min-h-px flex-1 bg-[#eee]" role="presentation" aria-hidden />
              </div>
              <div className="flex max-w-full flex-wrap">
                {folders.map((name) => {
                  const cornerSrc = folderCornerBadgeByName[name];
                  return (
                    <div key={name} className={thisPcItemRow}>
                      <div className="relative flex h-12 w-15 shrink-0 items-center justify-center">
                        <ExplorerFolderIcon width={48} height={48} title={name} />
                        {cornerSrc ? (
                          <span
                            className="pointer-events-none absolute bottom-0 right-0 flex h-[32px] w-[32px] items-center justify-center]"
                            aria-hidden
                          >
                            <Image
                              src={cornerSrc}
                              alt=""
                              width={32}
                              height={32}
                              className="object-contain select-none"
                              draggable={false}
                            />
                          </span>
                        ) : null}
                      </div>
                      <span className="min-w-0 mt-1.5 flex-1 break-keep text-[11px] leading-tight text-black">{name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-3 pb-2 pt-3">
              <div className={thisPcSectionHeaderRow}>
                <i className="fa-solid fa-chevron-down mr-1.5 shrink-0 text-[8px] text-[#3190c5]" aria-hidden />
                <span className="shrink-0">장치 및 드라이브 (2)</span>
                <div className="ml-[5px] h-px min-h-px flex-1 bg-[#eee]" role="presentation" aria-hidden />
              </div>
              <div className="flex max-w-full flex-wrap">
                {drives.map((d) => (
                  <div key={d.label} className={thisPcItemRow}>
                    <div className="relative flex h-12 w-15 items-center justify-center">
                      <Image
                        src="/icons/desktop/diskIcon.png"
                        alt=""
                        width={40}
                        height={40}
                        className="h-10 w-10 object-contain select-none"
                        draggable={false}
                      />
                      {d.showWin ? (
                        <span className="absolute top-2 left-1 text-[18px] leading-none text-winSkyBlue" aria-hidden>
                          <i className="fa-brands fa-windows" />
                        </span>
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 break-keep text-[11px] font-normal leading-snug text-black">{d.label}</div>
                      <div className="mb-0.5 h-2.5 w-full overflow-hidden rounded-sm border border-[#c8c8c8] bg-[#e8e8e8]">
                        <div className="h-full bg-winBlue" style={{ width: `${d.pct}%` }} />
                      </div>
                      <div className="break-keep text-[10px] leading-tight text-[#505050]">{d.meta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={exStatusBar}>
            <span>9개 항목</span>
            <div className={exStatusRight}>
              <button type="button" className={exStatusIconBtn} aria-label="자세히">
                <i className="fa-solid fa-list" />
              </button>
              <button type="button" className={exStatusIconBtn} aria-label="큰 아이콘">
                <i className="fa-regular fa-square" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
