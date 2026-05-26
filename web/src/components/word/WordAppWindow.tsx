"use client";

import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaArrowRotateLeft,
  FaArrowRotateRight,
  FaBook,
  FaFloppyDisk,
  FaPaste,
  FaQuoteLeft,
  FaRegCopy,
  FaScissors,
} from "react-icons/fa6";
import type { PortfolioPayload } from "@/types/portfolio";

type Props = {
  data: PortfolioPayload;
};

const wordBlue = "bg-[#2b579a]";
const ribbonBg = "bg-[#f3f3f3]";
const tabInactive = "border border-transparent border-b-0 px-3 py-1.5 text-xs text-[#444] hover:bg-white/40";
const tabActive = "border border-[#d4d4d4] border-b-0 bg-white px-3 py-1.5 text-xs font-medium text-[#222]";

function RibbonBtn({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-6 min-w-[22px] items-center justify-center rounded-sm border border-[#d0d0d0] bg-white px-1 text-[11px] text-[#333] shadow-[inset_0_1px_0_#fff]">
      {children}
    </span>
  );
}

export function WordAppWindow({ data }: Props) {
  const docTitle = "자기소개.docx";
  const { about, profile } = data;
  const approxWords = Math.max(
    1,
    Math.round((about.intro.length + about.philosophy.length + about.goals.length) / 3)
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col font-[Calibri,Segoe_UI,system-ui,sans-serif]">
      {/* 빠른 실행 도구줄 — 창 제어는 바깥 `WinFrameTitleBar`와 동일 */}
      <div className={`flex h-8 shrink-0 items-center gap-0.5 pl-1 pr-2 text-white ${wordBlue}`}>
        <button type="button" className="flex h-6 w-6 items-center justify-center rounded hover:bg-white/10" aria-label="저장">
          <FaFloppyDisk className="text-sm" aria-hidden />
        </button>
        <button type="button" className="flex h-6 w-6 items-center justify-center rounded hover:bg-white/10" aria-label="실행 취소">
          <FaArrowRotateLeft className="text-xs" aria-hidden />
        </button>
        <button type="button" className="flex h-6 w-6 items-center justify-center rounded hover:bg-white/10" aria-label="다시 실행">
          <FaArrowRotateRight className="text-xs" aria-hidden />
        </button>
        <span className="min-w-0 flex-1 truncate px-2 text-center text-xs font-normal tracking-tight">{docTitle}</span>
      </div>

      {/* Tabs + Tell me */}
      <div className={`flex h-8 shrink-0 items-center gap-1 border-b border-[#d4d4d4] px-1 ${ribbonBg}`}>
        <button type="button" className="rounded-sm bg-[#2b579a] px-2 py-1 text-[11px] font-medium text-white">
          파일
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
          {(["홈", "삽입", "디자인", "레이아웃", "참조", "편지", "검토", "보기"] as const).map((t) => (
            <button key={t} type="button" className={t === "홈" ? tabActive : tabInactive}>
              {t}
            </button>
          ))}
        </div>
        <div className="hidden shrink-0 sm:block">
          <input
            type="search"
            readOnly
            placeholder="작업할 내용을 알려주세요."
            className="w-[min(220px,28vw)] rounded-sm border border-[#c8c8c8] bg-white px-2 py-1 text-[11px] text-[#555] outline-none"
            aria-label="도움말 검색"
          />
        </div>
      </div>

      {/* Ribbon */}
      <div className={`shrink-0 border-b border-[#d0d0d0] px-2 py-1.5 ${ribbonBg}`}>
        <div className="flex flex-wrap items-end gap-x-3 gap-y-2 text-[#333]">
          <div className="flex flex-col items-center border-r border-[#d8d8d8] pr-3">
            <div className="flex gap-0.5">
              <RibbonBtn>
                <FaPaste className="text-sm" aria-hidden />
              </RibbonBtn>
              <RibbonBtn>
                <FaScissors className="text-[10px]" aria-hidden />
              </RibbonBtn>
              <RibbonBtn>
                <FaRegCopy className="text-[10px]" aria-hidden />
              </RibbonBtn>
            </div>
            <span className="mt-0.5 text-[10px] text-[#666]">클립보드</span>
          </div>
          <div className="flex flex-col items-center border-r border-[#d8d8d8] pr-3">
            <div className="flex items-center gap-1">
              <span className="rounded border border-[#c8c8c8] bg-white px-1.5 py-0.5 text-[11px]">Calibri</span>
              <span className="rounded border border-[#c8c8c8] bg-white px-1.5 py-0.5 text-[11px]">11</span>
              <RibbonBtn>
                <span className="font-bold">B</span>
              </RibbonBtn>
              <RibbonBtn>
                <span className="italic">I</span>
              </RibbonBtn>
              <RibbonBtn>
                <span className="underline">U</span>
              </RibbonBtn>
            </div>
            <span className="mt-0.5 text-[10px] text-[#666]">글꼴</span>
          </div>
          <div className="flex flex-col items-center border-r border-[#d8d8d8] pr-3">
            <div className="flex gap-0.5">
              <RibbonBtn>
                <FaAlignLeft aria-hidden />
              </RibbonBtn>
              <RibbonBtn>
                <FaAlignCenter aria-hidden />
              </RibbonBtn>
              <RibbonBtn>
                <FaAlignRight aria-hidden />
              </RibbonBtn>
              <RibbonBtn>
                <FaAlignJustify aria-hidden />
              </RibbonBtn>
            </div>
            <span className="mt-0.5 text-[10px] text-[#666]">단락</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex gap-0.5">
              <span className="rounded border border-[#c8c8c8] bg-white px-2 py-1 text-[10px] leading-tight">
                일반
                <br />
                <span className="text-[9px] text-[#888]">+ 본문 1</span>
              </span>
            </div>
            <span className="mt-0.5 text-[10px] text-[#666]">스타일</span>
          </div>
        </div>
      </div>

      {/* Rulers + page */}
      <div className="flex min-h-0 flex-1 flex-col bg-[#c6c6c6]">
        <div className="flex h-5 shrink-0 border-b border-[#b0b0b0] bg-[#e8e8e8] pl-8 pr-2 text-[9px] text-[#555]">
          <div className="flex flex-1 items-end border-l border-[#aaa] pl-1">
            {Array.from({ length: 16 }, (_, i) => (
              <span key={i} className="inline-block w-6 border-l border-[#ccc] text-center">
                {i % 2 === 0 ? "|" : ""}
              </span>
            ))}
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto px-5 py-8 sm:px-10 sm:py-12">
          <div
            className="wordDocPage mx-auto min-h-[min(58vh,500px)] w-full max-w-[720px] border border-[#e0e0e0] bg-white px-12 py-14 shadow-[0_1px_0_rgba(0,0,0,0.06),0_4px_24px_rgba(0,0,0,0.12)] sm:px-16 sm:py-20 md:px-20 md:py-24"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #fff 0%, #fafafa 100%), repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(43,87,154,0.04) 24px)",
            }}
          >
            <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#888]">
              {profile.name} · 자기소개 초안
            </p>
            <h1 className="mb-1 border-b border-neutral-200 pb-3 text-[22px] font-light leading-tight tracking-tight text-[#2E5395]">
              {profile.title}
            </h1>
            <p className="mb-8 text-[10px] text-neutral-500">
              마지막으로 저장한 사용자: {profile.name} · 일반 · 한글
            </p>

            <section className="mb-10">
              <h2 className="mb-3 flex items-center gap-2 text-[12px] font-semibold tracking-wide text-neutral-800">
                <span className="inline-block h-2 w-2 rounded-sm bg-[#2b579a]" aria-hidden />
                경험과 배경
              </h2>
              <p className="text-[11pt] leading-[1.85] text-neutral-900 [text-align:justify] first-letter:float-left first-letter:mr-2 first-letter:mt-0.5 first-letter:font-serif first-letter:text-[2.75rem] first-letter:font-semibold first-letter:leading-none first-letter:text-[#2b579a]">
                {about.intro}
              </p>
            </section>

            <section className="mb-10 rounded-sm border border-[#d6e4f7] bg-gradient-to-br from-[#f7fbff] to-[#eef4fc] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#4a6fa5]">
                <FaQuoteLeft className="text-[10px] opacity-70" aria-hidden />
                개발 철학
              </div>
              <blockquote className="border-l-[3px] border-[#2b579a] pl-4 text-[11pt] italic leading-[1.8] text-neutral-800">
                {about.philosophy}
              </blockquote>
            </section>

            <section>
              <h2 className="mb-3 flex items-center gap-2 text-[12px] font-semibold tracking-wide text-neutral-800">
                <span className="inline-block h-2 w-2 rounded-sm bg-[#c4753b]" aria-hidden />
                앞으로의 목표
              </h2>
              <p className="rounded-sm border border-[#f0d78a] bg-[#fff2cc] px-5 py-4 text-[11pt] leading-[1.85] text-neutral-900 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)] [text-align:justify]">
                <span className="mr-1.5 inline-block rounded bg-[#f7b731]/35 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#6b4e00]">
                  중요
                </span>
                {about.goals}
              </p>
            </section>

            <div className="mt-12 border-t border-dotted border-neutral-300 pt-3 text-center text-[9px] text-neutral-400">
              — 페이지 끝 —
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex h-6 shrink-0 items-center justify-between border-t border-[#b8b8b8] bg-[#f0f0f0] px-2 text-[11px] text-[#333]">
        <div className="flex items-center gap-3">
          <span>페이지 1/1</span>
          <span>단어 약 {approxWords}개</span>
          <FaBook className="text-[#888]" aria-label="맞춤법" />
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">읽기용 레이아웃</span>
          <span className="hidden sm:inline">인쇄용 레이아웃</span>
          <span className="rounded border border-[#ccc] bg-white px-1.5 py-0.5">100%</span>
        </div>
      </div>
    </div>
  );
}
