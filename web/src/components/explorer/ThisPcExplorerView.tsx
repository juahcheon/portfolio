"use client";

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

const drives = [
  { label: "로컬 디스크 (C:)", meta: "207GB 중 120GB 사용 가능", pct: 42, showWin: true },
  { label: "새 볼륨 (D:)", meta: "24.8GB 중 15.7GB 사용 가능", pct: 37, showWin: false },
];

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
            <div className="border-b border-[#e5e5e5] px-3 pb-3 pt-2">
              <div className="mb-2.5 flex cursor-default items-center gap-1.5 text-xs font-normal text-[#3190c5]">
                <i className="fa-solid fa-chevron-down text-[8px] text-[#3190c5]" aria-hidden />
                <span>폴더 (7)</span>
              </div>
              <div className="grid max-w-full grid-cols-[repeat(auto-fill,minmax(76px,_1fr))] gap-x-2 gap-y-3">
                {folders.map((name) => (
                  <div
                    key={name}
                    className="flex cursor-default flex-col items-center gap-1.5 rounded-sm border border-transparent px-1 py-1.5 text-center hover:border-[#c4e2f8] hover:bg-[#e5f3ff]"
                  >
                    <ExplorerFolderIcon width={48} height={48} title={name} />
                    <span className="break-keep text-[11px] leading-tight text-black">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-3 pb-2 pt-3">
            <div className="mb-2.5 flex cursor-default items-center gap-1.5 text-xs font-normal text-[#3190c5]">
            <i className="fa-solid fa-chevron-down text-[8px] text-[#3190c5]" aria-hidden />
                <span>장치 및 드라이브 (2)</span>
              </div>
              {drives.map((d) => (
                <div
                  key={d.label}
                  className="flex cursor-default items-start gap-3 border-b border-[#f0f0f0] px-1 py-2.5 last:border-b-0 hover:bg-[#f7f7f7]"
                >
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center text-[28px] text-[#5a5a5a]">
                    <i className="fa-solid fa-hard-drive" aria-hidden />
                    {d.showWin ? (
                      <span className="absolute bottom-0.5 right-0.5 text-[10px] text-winBlue" aria-hidden>
                        <i className="fa-brands fa-windows" />
                      </span>
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 text-xs font-normal text-black">{d.label}</div>
                    <div className="mb-1 h-3 overflow-hidden rounded-sm border border-[#c8c8c8] bg-[#e8e8e8]">
                      <div className="h-full bg-winBlue" style={{ width: `${d.pct}%` }} />
                    </div>
                    <div className="text-[11px] text-[#505050]">{d.meta}</div>
                  </div>
                </div>
              ))}
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
