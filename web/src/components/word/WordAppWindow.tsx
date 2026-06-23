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
  FaRegCopy,
  FaScissors,
} from "react-icons/fa6";
import type { PortfolioPayload } from "@/types/portfolio";

type Props = {
  data: PortfolioPayload;
};

const wordBlue = "bg-[#2b579a]";
const ribbonBg = "bg-[#f3f3f3]";
const tabInactive =
  "border border-transparent border-b-0 px-3 py-1.5 text-xs text-[#444] hover:bg-white/40";
const tabActive =
  "border border-[#d4d4d4] border-b-0 bg-white px-3 py-1.5 text-xs font-medium text-[#222]";

function RibbonBtn({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-6 min-w-[22px] items-center justify-center rounded-sm border border-[#d0d0d0] bg-white px-1 text-[11px] text-[#333] shadow-[inset_0_1px_0_#fff]">
      {children}
    </span>
  );
}

function TimelineBlock({
  heading,
  children,
  isLast = false,
}: {
  heading: string;
  children: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <div className={`relative ${isLast ? "" : "mb-6"}`}>
      <div
        className="absolute -left-[26px] top-[1px] z-10 h-[9px] w-[9px] rounded-full bg-[#2b579a]"
        style={{ boxShadow: "0 0 0 2px white, 0 0 0 3.5px #2b579a" }}
      />
      <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[.16em] text-[#2b579a]">
        {heading}
      </p>
      {children}
    </div>
  );
}

function ExpCard({
  name,
  badge,
  sub,
  stack,
  bullets,
}: {
  name: string;
  badge: string;
  sub: string;
  stack: string;
  bullets: string[];
}) {
  return (
    <div className="rounded border border-[#edf0f7] bg-[#fafbfd] px-4 py-3.5">
      <div className="mb-0.5 flex flex-wrap items-baseline gap-2">
        <span className="text-[11pt] font-bold text-[#111]">{name}</span>
        <span className="rounded-[2px] bg-[#e8eef9] px-[7px] py-[2px] text-[8px] font-semibold text-[#2b579a]">
          {badge}
        </span>
      </div>
      <p className="mb-2 text-[9pt] leading-relaxed text-[#555]">{sub}</p>
      <p className="mb-2.5 text-[8.5pt] leading-relaxed text-[#999]">{stack}</p>
      <ul className="space-y-0.5">
        {bullets.map((b, i) => (
          <li key={i} className="relative pl-[10px] text-[9pt] leading-[1.65] text-[#333]">
            <span className="absolute left-0 font-bold text-[#2b579a]">·</span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function WordPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[640px] border border-[#e0e0e0] bg-white px-12 py-10 shadow-[0_1px_0_rgba(0,0,0,0.06),0_4px_24px_rgba(0,0,0,0.12)]">
      {children}
    </div>
  );
}

function PageFooter({ page, total, name }: { page: number; total: number; name: string }) {
  return (
    <div className="mt-8 flex justify-between border-t border-[#f0f0f0] pt-2 text-[9px] text-[#ccc]">
      <span>페이지 {page}/{total}</span>
      <span>마지막 저장: {name}</span>
    </div>
  );
}

export function WordAppWindow({ data }: Props) {
  const { profile, projects, jobs } = data;
  const dsHelper = projects[0];
  const job = jobs[0];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* 빠른 실행 도구줄 */}
      <div className={`flex h-8 shrink-0 items-center gap-0.5 pl-1 pr-2 text-white ${wordBlue}`}>
        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center rounded hover:bg-white/10"
          aria-label="저장"
        >
          <FaFloppyDisk className="text-sm" aria-hidden />
        </button>
        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center rounded hover:bg-white/10"
          aria-label="실행 취소"
        >
          <FaArrowRotateLeft className="text-xs" aria-hidden />
        </button>
        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center rounded hover:bg-white/10"
          aria-label="다시 실행"
        >
          <FaArrowRotateRight className="text-xs" aria-hidden />
        </button>
        <span className="min-w-0 flex-1 truncate px-2 text-center text-xs font-normal tracking-tight">
          자기소개.docx
        </span>
      </div>

      {/* 탭 */}
      <div
        className={`flex h-8 shrink-0 items-center gap-1 border-b border-[#d4d4d4] px-1 ${ribbonBg}`}
      >
        <button
          type="button"
          className="rounded-sm bg-[#2b579a] px-2 py-1 text-[11px] font-medium text-white"
        >
          파일
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
          {(["홈", "삽입", "디자인", "레이아웃", "참조", "편지", "검토", "보기"] as const).map(
            (t) => (
              <button key={t} type="button" className={t === "홈" ? tabActive : tabInactive}>
                {t}
              </button>
            )
          )}
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

      {/* 리본 */}
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
              <span className="rounded border border-[#c8c8c8] bg-white px-1.5 py-0.5 text-[11px]">
                Pretendard
              </span>
              <span className="rounded border border-[#c8c8c8] bg-white px-1.5 py-0.5 text-[11px]">
                11
              </span>
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
            <span className="rounded border border-[#c8c8c8] bg-white px-2 py-1 text-[10px] leading-tight">
              일반
              <br />
              <span className="text-[9px] text-[#888]">+ 본문 1</span>
            </span>
            <span className="mt-0.5 text-[10px] text-[#666]">스타일</span>
          </div>
        </div>
      </div>

      {/* 눈금자 */}
      <div className="flex h-5 shrink-0 border-b border-[#b0b0b0] bg-[#e8e8e8] pl-8 pr-2 text-[9px] text-[#555]">
        <div className="flex flex-1 items-end border-l border-[#aaa] pl-1">
          {Array.from({ length: 16 }, (_, i) => (
            <span key={i} className="inline-block w-6 border-l border-[#ccc] text-center">
              {i % 2 === 0 ? "|" : ""}
            </span>
          ))}
        </div>
      </div>

      {/* 문서 영역 */}
      <div className="min-h-0 flex-1 overflow-auto bg-[#c6c6c6] px-5 py-8 sm:px-10 sm:py-10">
        {/* 1페이지 — 소개 */}
        <WordPage>
          {/* 헤더 */}
          <div className="mb-7 border-b border-[#e8e8e8] pb-6">
            <p className="mb-2.5 text-[9px] uppercase tracking-[.14em] text-[#aaa]">
              자기소개 · {profile.name}
            </p>
            <p className="mb-1.5 text-[26px] font-extrabold leading-none tracking-[-1px] text-[#111]">
              {profile.name}
            </p>
            <p className="text-[12px] font-medium text-[#2b579a]">{profile.title}</p>
          </div>

          {/* 타임라인 */}
          <div className="relative pl-8">
            <div className="absolute bottom-3 left-[10px] top-[5px] z-0 w-px bg-gradient-to-b from-[#2b579a] to-[#2b579a]/10" />

            <TimelineBlock heading="소개">
              <p className="text-[10pt] leading-[1.78] text-[#222]">
                국어국문학을 전공하며 사람의 의도와 문장의 구조를 읽는 법을 배웠고, 개발을 통해 그 이해를 실제 화면과 기능으로 구현하게 되었습니다. 사용자가 자연스럽게 이해할 수 있는 흐름을 고민하면서도, 코드의 구조와 데이터의 흐름은 논리적으로 설계하는{" "}
                <strong className="font-semibold text-[#111]">프론트엔드 개발자</strong>입니다.
              </p>
            </TimelineBlock>

            <TimelineBlock heading="문제 해결 방식">
              <p className="text-[10pt] leading-[1.78] text-[#222]">
                문제가 생기면 먼저 사용자가 어디에서 불편을 겪는지 살피고, 그 뒤에 코드·데이터·환경을 차례로 확인합니다. 겉으로 보이는 현상만 고치기보다 원인을 찾고, 같은 문제가 반복되지 않도록 구조를 정리하려 합니다. 환경별 API 분기, 인증 흐름, 데이터 캐싱을 통한 성능 개선을 직접 경험하며 트러블슈팅 감각을 키워왔습니다.
              </p>
            </TimelineBlock>

            <TimelineBlock heading="지향점" isLast>
              <p className="text-[10pt] leading-[1.78] text-[#222]">
                사람의 언어와 맥락을 이해하는 감각, 그리고 복잡한 문제를 구조로 정리하는 논리를 함께 발휘하겠습니다. 사용자의 의도를 정확히 읽고, 팀이 함께 유지보수할 수 있는 코드와 화면으로 완성하는 개발자로 기여하겠습니다.
              </p>
            </TimelineBlock>
          </div>

          <PageFooter page={1} total={2} name={profile.name} />
        </WordPage>

        {/* 페이지 간격 */}
        <div className="h-6" />

        {/* 2페이지 — 경험 */}
        <WordPage>
          <div className="relative pl-8">
            <div className="absolute bottom-3 left-[10px] top-[5px] z-0 w-px bg-gradient-to-b from-[#2b579a] to-[#2b579a]/10" />

            <TimelineBlock heading="사이드 프로젝트">
              <ExpCard
                name={dsHelper.name}
                badge={dsHelper.aboutBadge ?? `팀 프로젝트 · ${dsHelper.role}`}
                sub={dsHelper.subtitle ?? dsHelper.description.split(".")[0] + "."}
                stack={dsHelper.stackSummary}
                bullets={dsHelper.aboutHighlights ?? dsHelper.features?.slice(0, 4) ?? []}
              />
            </TimelineBlock>

            <TimelineBlock heading="근무 경험" isLast>
              <ExpCard
                name={job.serviceName ?? job.company}
                badge={`${job.periodLabel} · ${job.durationLabel}`}
                sub={`${job.company} · ${job.role}`}
                stack={job.stackSummary ?? job.stack.framework}
                bullets={job.aboutHighlights ?? job.highlights.slice(0, 3)}
              />
            </TimelineBlock>
          </div>

          <PageFooter page={2} total={2} name={profile.name} />
        </WordPage>
      </div>

      {/* 상태 표시줄 */}
      <div className="flex h-6 shrink-0 items-center justify-between border-t border-[#b8b8b8] bg-[#f0f0f0] px-2 text-[11px] text-[#333]">
        <div className="flex items-center gap-3">
          <span>2페이지</span>
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
