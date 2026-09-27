"use client";

import { useRef, useState } from "react";
import { FiChevronLeft, FiFileText } from "react-icons/fi";
import styles from "./WordMobile.module.scss";
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
import { openWindowFromDesktopId } from "@/lib/windows";
import { useDesktopStore } from "@/store/desktopStore";
import type { PortfolioPayload } from "@/types/portfolio";

type Props = {
  data: PortfolioPayload;
  mobile?: boolean;
};

const wordBlue = "bg-[#2b579a]";
const ribbonBg = "bg-[#f3f3f3]";
const tabInactive =
  "border border-transparent border-b-0 px-3 py-1.5 text-[13px] text-[#444] hover:bg-white/40";
const tabActive =
  "border border-[#d4d4d4] border-b-0 bg-white px-3 py-1.5 text-[13px] font-medium text-[#222]";

function RibbonBtn({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-6 min-w-[22px] items-center justify-center rounded-sm border border-[#d0d0d0] bg-white px-1 text-[13px] text-[#333] shadow-[inset_0_1px_0_#fff]">
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
        className="word-timeline-dot absolute -left-[26px] top-[6px] z-10 h-[9px] w-[9px] rounded-full bg-[#2b579a]"
        style={{ boxShadow: "0 0 0 2px white, 0 0 0 3.5px var(--word-accent, #2b579a)" }}
      />
      <p className="mb-2 text-[14px] font-bold uppercase tracking-[.16em] text-[#2b579a]">
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
    <div className="word-experience-card rounded border border-[#edf0f7] bg-[#fafbfd] px-4 py-3.5">
      <div className="mb-0.5 flex flex-wrap items-baseline gap-2">
        <span className="text-[20px] font-bold text-[#111]">{name}</span>
        <span className="rounded-[2px] bg-[#e8eef9] px-[7px] py-[2px] text-[13px] font-semibold text-[#2b579a]">
          {badge}
        </span>
      </div>
      <p className="mb-2 text-[16px] roomy:text-[14px] leading-relaxed text-[#555]">{sub}</p>
      <p className="mb-2.5 text-[13px] leading-relaxed text-[#999]">{stack}</p>
      <ul className="space-y-1">
        {bullets.map((b, i) => (
          <li key={i} className="relative pl-[10px] text-[16px] roomy:text-[14px] leading-[1.65] text-[#333]">
            <span className="absolute left-0 font-bold text-[#2b579a]">·</span>
            {b.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
              part.startsWith("**") && part.endsWith("**")
                ? <strong key={index} className="font-bold text-[#111]">{part.slice(2, -2)}</strong>
                : part
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function WordPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="word-page mx-auto flex min-h-0 roomy:min-h-[900px] w-full max-w-[640px] flex-col border border-[#e0e0e0] bg-white px-4 py-6 roomy:px-12 roomy:py-10 shadow-[0_1px_0_rgba(0,0,0,0.06),0_4px_24px_rgba(0,0,0,0.12)]">
      {children}
    </div>
  );
}

function PageFooter({ page, total, name }: { page: number; total: number; name: string }) {
  return (
    <div className="word-page-footer mt-8 flex justify-between border-t border-[#f0f0f0] pt-2 text-[13px] text-[#ccc]">
      <span>페이지 {page}/{total}</span>
      <span>마지막 저장: {name}</span>
    </div>
  );
}

export function WordAppWindow({ data, mobile = false }: Props) {
  const { profile, jobs, projects } = data;
  const openWindow = useDesktopStore((s) => s.openWindow);
  const minimizeAll = useDesktopStore((s) => s.minimizeAll);
  const documentRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const jumpToPage = (index: number) => {
    const container = documentRef.current;
    const target = container?.querySelectorAll<HTMLElement>(".word-page")[index];
    if (container && target) container.scrollTo({ top: container.scrollTop + target.getBoundingClientRect().top - container.getBoundingClientRect().top - 12, behavior: "smooth" });
  };

  const openProject = (projectSlug: string) => {
    const win = openWindowFromDesktopId("projects", data);
    const icon = data.desktop.icons.find((item) => item.windowId === "projects");
    if (win) openWindow({ ...win, projectSlug, taskbarIconUrl: icon?.imageUrl });
  };

  return (
    <div className={`word-app flex min-h-0 flex-1 flex-col ${mobile ? styles.mobile : ""}`}>
      {mobile && <>
        <header className={styles.header}>
          <button type="button" aria-label="홈으로 돌아가기" onClick={minimizeAll}><FiChevronLeft aria-hidden /></button>
          <div><strong>자기소개.docx</strong><span>Word · 읽기 전용</span></div>
          <img src="/icons/desktop/word.png" alt="" />
        </header>
        <div className={styles.viewBar}><span><FiFileText aria-hidden />모바일 보기</span><span>{page + 1} / 3페이지</span></div>
      </>}
      {/* 빠른 실행 도구줄 */}
      <div className={`hidden roomy:flex h-8 shrink-0 items-center gap-0.5 pl-1 pr-2 text-white ${wordBlue}`}>
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
          <FaArrowRotateLeft className="text-[13px]" aria-hidden />
        </button>
        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center rounded hover:bg-white/10"
          aria-label="다시 실행"
        >
          <FaArrowRotateRight className="text-[13px]" aria-hidden />
        </button>
        <span className="min-w-0 flex-1 truncate px-2 text-center text-[13px] font-normal tracking-tight">
          자기소개.docx
        </span>
      </div>

      {/* 탭 */}
      <div
        className={`hidden roomy:flex h-8 shrink-0 items-center gap-1 border-b border-[#d4d4d4] px-1 ${ribbonBg}`}
      >
        <button
          type="button"
          className="rounded-sm bg-[#2b579a] px-2 py-1 text-[13px] font-medium text-white"
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
            className="w-[min(220px,28vw)] rounded-sm border border-[#c8c8c8] bg-white px-2 py-1 text-[13px] text-[#555] outline-none"
            aria-label="도움말 검색"
          />
        </div>
      </div>

      {/* 리본 */}
      <div className={`hidden roomy:block shrink-0 border-b border-[#d0d0d0] px-2 py-1.5 ${ribbonBg}`}>
        <div className="flex flex-wrap items-end gap-x-3 gap-y-2 text-[#333]">
          <div className="flex flex-col items-center border-r border-[#d8d8d8] pr-3">
            <div className="flex gap-0.5">
              <RibbonBtn>
                <FaPaste className="text-sm" aria-hidden />
              </RibbonBtn>
              <RibbonBtn>
                <FaScissors className="text-[13px]" aria-hidden />
              </RibbonBtn>
              <RibbonBtn>
                <FaRegCopy className="text-[13px]" aria-hidden />
              </RibbonBtn>
            </div>
            <span className="mt-0.5 text-[13px] text-[#666]">클립보드</span>
          </div>
          <div className="flex flex-col items-center border-r border-[#d8d8d8] pr-3">
            <div className="flex items-center gap-1">
              <span className="rounded border border-[#c8c8c8] bg-white px-1.5 py-0.5 text-[13px]">
                Pretendard
              </span>
              <span className="rounded border border-[#c8c8c8] bg-white px-1.5 py-0.5 text-[13px]">
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
            <span className="mt-0.5 text-[13px] text-[#666]">글꼴</span>
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
            <span className="mt-0.5 text-[13px] text-[#666]">단락</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="rounded border border-[#c8c8c8] bg-white px-2 py-1 text-[13px] leading-tight">
              일반
              <br />
              <span className="text-[13px] text-[#888]">+ 본문 1</span>
            </span>
            <span className="mt-0.5 text-[13px] text-[#666]">스타일</span>
          </div>
        </div>
      </div>

      {/* 눈금자 */}
      <div className="hidden roomy:flex h-5 shrink-0 border-b border-[#b0b0b0] bg-[#e8e8e8] pl-8 pr-2 text-[13px] text-[#555]">
        <div className="flex flex-1 items-end border-l border-[#aaa] pl-1">
          {Array.from({ length: 16 }, (_, i) => (
            <span key={i} className="inline-block w-6 border-l border-[#ccc] text-center">
              {i % 2 === 0 ? "|" : ""}
            </span>
          ))}
        </div>
      </div>

      {/* 문서 영역 */}
      <div ref={documentRef} onScroll={mobile ? () => {
        const container = documentRef.current;
        if (!container) return;
        const top = container.getBoundingClientRect().top;
        let current = 0;
        container.querySelectorAll<HTMLElement>(".word-page").forEach((item, index) => { if (item.getBoundingClientRect().top <= top + 100) current = index; });
        setPage(current);
      } : undefined} className="word-document-scroll min-h-0 flex-1 overflow-auto bg-[#c6c6c6] px-3 py-4 roomy:px-10 roomy:py-10">
        {/* 1페이지 — 소개 */}
        <WordPage>
          {/* 헤더 */}
          <div className="word-profile-header mb-7 border-b border-[#e8e8e8] pb-6">
            <p className="mb-1.5 text-[32px] font-extrabold leading-none tracking-[-1px] text-[#111]">
              {profile.name}
            </p>
            <p className="text-[16px] font-medium text-[#2b579a]">{profile.title}</p>
          </div>

          {/* 타임라인 */}
          <div className="flex-1 relative pl-7 roomy:pl-8">
            <div className="absolute bottom-3 left-[10px] top-[5px] z-0 w-px bg-gradient-to-b from-[#2b579a] to-[#2b579a]/10" />

            <TimelineBlock heading="소개">
              <p className="text-[16px] leading-[1.78] text-[#222]">
                국어국문학을 전공하며 사람의 의도와 문장의 구조를 읽는 법을 배웠고, 개발을 통해 그 이해를 실제 화면과 기능으로 구현하게 되었습니다. 사용자가 자연스럽게 이해할 수 있는 흐름을 고민하면서도, 코드의 구조와 데이터의 흐름은 논리적으로 설계하는{" "}
                웹 개발자입니다.
              </p>
            </TimelineBlock>

            <TimelineBlock heading="문제 해결 방식">
              <p className="text-[16px] leading-[1.78] text-[#222]">
                문제가 생기면 먼저 사용자가 어디에서 불편을 겪는지 살피고, 그 뒤에 코드, 데이터, 환경을 차례로 확인합니다. 겉으로 보이는 현상만 고치기보다 원인을 찾고, 같은 문제가 반복되지 않도록 구조를 정리하려 합니다. 환경별 API 분기, 인증 흐름, 데이터 캐싱을 통한 성능 개선을 직접 경험하며 트러블슈팅 감각을 키워왔습니다.
              </p>
            </TimelineBlock>

            <TimelineBlock heading="지향점" isLast={!profile.aiToolAttitude}>
              <p className="text-[16px] leading-[1.78] text-[#222]">
                사람의 언어와 맥락을 이해하는 감각, 그리고 복잡한 문제를 구조로 정리하는 논리를 함께 발휘하겠습니다. 사용자의 의도를 정확히 읽고, 팀이 함께 유지보수할 수 있는 코드와 화면으로 완성하는 개발자로 기여하겠습니다.
              </p>
            </TimelineBlock>
            {profile.aiToolAttitude ? (
              <TimelineBlock heading={profile.aiToolAttitude.heading} isLast>
                <p className="text-[16px] leading-[1.78] text-[#222]">
                  {profile.aiToolAttitude.body}
                </p>
              </TimelineBlock>
            ) : null}
          </div>

          <PageFooter page={1} total={3} name={profile.name} />
        </WordPage>

        {/* 페이지 간격 */}
        <div className="h-6" />

        {/* 2페이지 — 경험 */}
        <WordPage>
          <div className="flex-1 pl-7 roomy:pl-8">
            <div className="relative">
              <div className="absolute bottom-0 left-[-22px] top-[5px] z-0 w-px bg-gradient-to-b from-[#2b579a] to-[#2b579a]/10" />
              <TimelineBlock heading="근무 경험" isLast>
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <ExpCard
                      key={job.company}
                      name={job.company}
                      badge={`${job.periodLabel}, ${job.durationLabel}`}
                      sub={[job.serviceName, job.role].filter(Boolean).join(", ")}
                      stack={job.stackSummary ?? job.stack.framework}
                      bullets={job.aboutHighlights ?? job.highlights.slice(0, 3)}
                    />
                  ))}
                </div>
              </TimelineBlock>
            </div>
          </div>

          <PageFooter page={2} total={3} name={profile.name} />
        </WordPage>

        <div className="h-6" />

        {/* 3페이지 — 프로젝트 소개 */}
        <WordPage>
          <section className="flex-1" aria-label="프로젝트 소개">
            <h2 className="mb-6 border-b border-[#e8e8e8] pb-4 text-[24px] font-bold text-[#2b579a]">프로젝트 소개</h2>
            <ul className="space-y-3">
              {projects.map((project) => (
                <li key={project.slug} className="word-project-summary flex flex-col roomy:flex-row items-start gap-4 rounded border border-[#edf0f7] bg-[#fafbfd] px-4 py-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1.5 text-[18px] font-bold text-[#111]">{project.name}</h3>
                    <p className="text-[16px] roomy:text-[14px] leading-[1.65] text-[#333]">{project.aboutSummary ?? project.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openProject(project.slug)}
                    aria-label={`${project.name} 프로젝트 보러가기`}
                    className="inline-flex min-h-11 roomy:min-h-9 shrink-0 cursor-pointer items-center self-start roomy:self-center rounded-full border border-[#2b579a] bg-[#2b579a] px-2.5 py-2 text-[13px] font-medium text-white hover:bg-[#244a83] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b579a]"
                  >
                    프로젝트 보러가기
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <PageFooter page={3} total={3} name={profile.name} />
        </WordPage>
      </div>

      {mobile && <nav className={styles.pageNav} aria-label="문서 페이지">
        {["소개", "근무 경험", "프로젝트"].map((label, index) => <button key={label} type="button" aria-current={page === index ? "page" : undefined} onClick={() => jumpToPage(index)}>{label}</button>)}
      </nav>}
      {/* 상태 표시줄 */}
      <div className="word-status flex h-7 shrink-0 items-center justify-between border-t border-[#b8b8b8] bg-[#f0f0f0] px-2 text-[13px] text-[#333]">
        <div className="flex items-center gap-3">
          <span>3페이지</span>
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
