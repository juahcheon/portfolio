"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FaBolt, FaChevronLeft, FaChevronRight, FaCodeBranch, FaLink, FaShieldHalved, FaTriangleExclamation } from "react-icons/fa6";
import type { Project, PortfolioPayload, ProjectScreenshot, StructuredTroubleshootingItem } from "@/types/portfolio";
import { ScreenshotModal } from "./ScreenshotModal";

function isStructured(item: unknown): item is StructuredTroubleshootingItem {
  return typeof item === "object" && item !== null && "발단" in item;
}

type Props = {
  mobile?: boolean;
  projects: PortfolioPayload["projects"];
  selectedProjectSlug?: string;
  onProjectSelect: (slug: string) => void;
};

const COPY = {
  title: "\ud504\ub85c\uc81d\ud2b8",
  auditSummary: "\ud504\ub85c\uc81d\ud2b8\uc758 \uad6c\uc870, \uc6b4\uc601 \ud658\uacbd, \ubb38\uc81c \ud574\uacb0 \uacfc\uc815\uc744 \ud655\uc778\ud558\ub294 \ub9ac\ud3ec\ud2b8",
  projectList: "\ud504\ub85c\uc81d\ud2b8 \ubaa9\ub85d",
  implemented: "\uae30\ub2a5",
  stack: "Stack",
  troubleshooting: "Troubleshooting",
  links: "Links",
  teamProject: "\ud300 \ud504\ub85c\uc81d\ud2b8",
  personal: "\uac1c\uc778 \ud504\ub85c\uc81d\ud2b8",
  team: "\ud300",
  contribution: "\uae30\uc5ec",
};

const PROJECT_COLORS: Record<string, string> = {
  dshelper: "#0dba53",
  portfolio: "#0078d4",
  weddy: "#7034f3",
};

function linkHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function stackTags(stackSummary: string) {
  return stackSummary
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function uniqueTags(tags: string[]) {
  return Array.from(new Set(tags));
}

function projectColor(project: Project) {
  return PROJECT_COLORS[project.slug] ?? "#1a0dab";
}

function projectStatus(project: Project) {
  if (project.statusLabel) return project.statusLabel;
  if (project.slug === "portfolio") return COPY.personal;
  return project.team;
}

function sidebarStatus(project: Project) {
  if (project.statusLabel) return project.statusLabel;
  if (project.slug === "dshelper") return COPY.teamProject;
  return projectStatus(project);
}

export function ProjectsPanelView({ projects, selectedProjectSlug, onProjectSelect, mobile = false }: Props) {
  const mainRef = useRef<HTMLElement>(null);
  const [previewScreenshot, setPreviewScreenshot] = useState<ProjectScreenshot | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const selectedProject = useMemo(
    () => projects.find((project) => project.slug === selectedProjectSlug) ?? projects[0],
    [projects, selectedProjectSlug]
  );

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
    setPreviewScreenshot(null);
  }, [selectedProjectSlug]);

  if (!selectedProject) {
    return null;
  }

  const accent = `var(--mobile-project-accent, ${projectColor(selectedProject)})`;
  const selectedTags = uniqueTags([
    ...stackTags(selectedProject.stackSummary),
    ...selectedProject.env.split(",").map((tag) => tag.trim()).filter(Boolean),
  ]);

  return (
    <div className="project-panel flex min-h-full min-w-0 flex-col bg-white text-[16px] text-[#202124] roomy:text-[19px]">
      <header className="border-b border-[#e8eaed] px-4 py-4 roomy:px-6 roomy:py-5">
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="m-0 text-[24px] font-semibold leading-tight text-[#202124] roomy:text-[33px]">{COPY.title}</h2>
            <p className="m-0 mt-1 hidden text-[17px] text-[#5f6368] roomy:block">{COPY.auditSummary}</p>
          </div>
        </div>
        {mobile && <label className="mt-4 block text-[13px] font-semibold">{COPY.projectList}<select aria-label={COPY.projectList} value={selectedProject.slug} onChange={(event) => onProjectSelect(event.target.value)} className="mt-1 block min-h-11 w-full rounded border border-[#cfd7df] bg-white px-3 text-base font-normal">{projects.map((project) => <option key={project.slug} value={project.slug}>{project.name}</option>)}</select></label>}
      </header>

      <div className="relative grid min-h-0 min-w-0 flex-1" style={{ gridTemplateColumns: mobile ? "minmax(0, 1fr)" : sidebarOpen ? "20fr 80fr" : "0fr 1fr" }}>
        {!mobile && <aside
          className="overflow-hidden border-r border-[#e8eaed] bg-[#f8fafd] transition-all duration-200"
          aria-label={COPY.projectList}
          style={{ minWidth: sidebarOpen ? 120 : 0 }}
        >
          <div className={`space-y-2 p-2 transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}>
            {projects.map((project) => {
              const active = project.slug === selectedProject.slug;
              const color = projectColor(project);
              return (
                <button
                  key={project.slug}
                  type="button"
                  className={`w-full cursor-pointer rounded border px-2.5 py-3 text-left transition ${
                    active ? "border-[#cfd7df] bg-white shadow-[0_1px_3px_rgba(60,64,67,0.18)]" : "border-transparent bg-transparent hover:bg-white"
                  }`}
                  onClick={() => onProjectSelect(project.slug)}
                >
                  <span className="block text-[17px] font-semibold text-[#202124]">{project.name}</span>
                  <span className="mt-1 block text-[14px] text-[#5f6368]">{sidebarStatus(project)}</span>
                  <span className="mt-2 flex items-center gap-1.5 text-[13px] text-[#70757a]">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} aria-hidden />
                    {project.slug}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>}

        <main ref={mainRef} className="relative min-h-0 min-w-0 overflow-auto break-words p-4 pb-8 roomy:p-7 roomy:pb-10">
          {!mobile && <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="absolute left-0 top-6 z-10 flex h-6 w-5 items-center justify-center rounded-r border border-l-0 border-[#e8eaed] bg-[#f8fafd] text-[13px] text-[#5f6368] hover:bg-[#e8eaed]"
            aria-label={sidebarOpen ? "목록 접기" : "목록 펼치기"}
          >
            {sidebarOpen ? <FaChevronLeft aria-hidden /> : <FaChevronRight aria-hidden />}
          </button>}
          <section className={`grid gap-4 ${mobile ? "" : "xl:grid-cols-[minmax(0,1fr)_270px]"}`}>
            <div>
              <div className="project-overview">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full px-2.5 py-1 text-[14px] font-medium text-white" style={{ backgroundColor: accent }}>
                  {projectStatus(selectedProject)}
                </span>
                {selectedProject.contribution ? (
                  <span className="rounded-full border border-[#dadce0] px-2.5 py-1 text-[14px] text-[#5f6368]">
                    {COPY.contribution} {selectedProject.contribution}
                  </span>
                ) : null}
              </div>

              <h3 className="m-0 mt-3 text-[28px] font-semibold leading-tight" style={{ color: accent }}>
                {selectedProject.name}
              </h3>
              <p className="m-0 mt-2 text-[16px] leading-relaxed text-[#4d5156] roomy:text-[19px]">{selectedProject.description}</p>
              </div>

              <div className="project-details-grid mt-5 grid gap-3 roomy:grid-cols-3">
                {(selectedProject.details ?? []).map((detail) => (
                  <div key={detail.label} className="project-info-card rounded border border-[#e8eaed] bg-white p-3 shadow-[0_1px_2px_rgba(60,64,67,0.08)]">
                    <p className="m-0 flex items-center gap-2 text-[14px] font-semibold text-[#3c4043]">
                      <FaBolt aria-hidden style={{ color: accent }} />
                      {detail.label}
                    </p>
                    <p className="m-0 mt-2 text-[17px] leading-relaxed text-[#5f6368]">{detail.value}</p>
                  </div>
                ))}
              </div>

              {selectedProject.screenshots && selectedProject.screenshots.length > 0 ? (
                <section className="mt-5" aria-label="작업했던 화면 미리보기">
                  <h4 className="m-0 text-[17px] font-semibold text-[#202124]">작업했던 화면 미리보기</h4>
                  <div className="mt-3 space-y-4">
                    {selectedProject.screenshots.map((screenshot) => (
                      <figure key={screenshot.imageUrl} className="m-0 overflow-hidden rounded border border-[#e8eaed] bg-white">
                        <button
                          type="button"
                          onClick={() => setPreviewScreenshot(screenshot)}
                          aria-label={`${screenshot.title} 확대 보기`}
                          aria-haspopup="dialog"
                          className="block w-full cursor-zoom-in border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#1a0dab]"
                        >
                          <img
                            src={screenshot.imageUrl}
                            alt={screenshot.title}
                            width={screenshot.width}
                            height={screenshot.height}
                            loading="lazy"
                            decoding="async"
                            className="block h-auto w-full"
                          />
                        </button>
                        <figcaption className="border-t border-[#e8eaed] p-3">
                          <p className="m-0 text-[17px] font-semibold text-[#202124]">{screenshot.title}</p>
                          <p className="m-0 mt-1 text-[17px] leading-relaxed text-[#5f6368]">{screenshot.description}</p>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              ) : null}

              {selectedProject.features && selectedProject.features.length > 0 ? (
                <section className="mt-5 rounded border border-[#e8eaed] bg-white p-4 shadow-[0_1px_2px_rgba(60,64,67,0.08)]">
                  <div className="flex items-center gap-2">
                    <FaCodeBranch aria-hidden style={{ color: accent }} />
                    <h4 className="m-0 text-[17px] font-semibold text-[#202124]">{COPY.implemented}</h4>
                  </div>
                  <ul className="m-0 mt-3 list-none space-y-2 p-0">
                    {selectedProject.features.map((feature) => (
                      <li key={feature} className="flex gap-2 text-[16px] leading-relaxed text-[#4d5156] roomy:text-[19px]">
                        <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} aria-hidden />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <section className="mb-5 mt-5 p-4">
                <div className="flex items-center gap-2">
                  <FaTriangleExclamation aria-hidden style={{ color: accent }} />
                  <h4 className="m-0 text-[17px] font-semibold text-[#202124]">{COPY.troubleshooting}</h4>
                </div>
                <ol className="m-0 mt-3 list-none space-y-4 p-0">
                  {(selectedProject.troubleshooting ?? []).map((item, index) => (
                    <li key={index}>
                      <p
                        className="mb-1.5 text-[14px] font-bold tracking-widest"
                        style={{ color: accent }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      {isStructured(item) ? (
                        <div className="overflow-hidden border border-[#111827]">
                          {(["발단", "전개", "해결"] as const).map((label, i) => (
                            <div
                              key={label}
                              className="grid text-[17px]"
                              style={{
                                gridTemplateColumns: mobile ? "minmax(0, 1fr)" : "74px minmax(0, 1fr)",
                                borderTop: i === 0 ? "none" : "1px solid #111827",
                              }}
                            >
                              <span className={`flex items-center px-2.5 py-1.5 text-[15px] font-bold text-[#111827] ${mobile ? "bg-[#f8fafd]" : "justify-center border-r border-[#111827] text-center"}`}>
                                {label}
                              </span>
                              <p className="m-0 px-2.5 py-1.5 text-[16px] leading-relaxed text-[#4b5563] roomy:text-[15px]">{item[label]}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="m-0 text-[17px] leading-relaxed text-[#4d5156]">{item}</p>
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            <aside className="space-y-4">
              <section className="rounded border border-[#e8eaed] bg-white p-4 shadow-[0_1px_2px_rgba(60,64,67,0.08)]">
                <div className="flex items-center gap-2">
                  <FaCodeBranch aria-hidden className="text-[#5f6368]" />
                  <h4 className="m-0 text-[17px] font-semibold text-[#202124]">{COPY.stack}</h4>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selectedTags.map((tag) => (
                    <span
                      key={`${selectedProject.slug}-${tag}`}
                      className="rounded border border-[#dadce0] bg-[#f8fafd] px-2 py-1 text-[17px] text-[#3c4043]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>

              <section className="rounded border border-[#e8eaed] bg-white p-4 shadow-[0_1px_2px_rgba(60,64,67,0.08)]">
                <div className="flex items-center gap-2">
                  <FaLink aria-hidden className="text-[#5f6368]" />
                  <h4 className="m-0 text-[17px] font-semibold text-[#202124]">{COPY.links}</h4>
                </div>
                <div className="mt-3 space-y-2">
                  {selectedProject.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded border border-[#dfe1e5] bg-white px-3 py-2 text-[17px] text-[#1a0dab] underline-offset-2 hover:bg-[#f8fafd] hover:underline"
                    >
                      <span className="block font-medium">{link.label}{link.visibility === "private" ? ", 비공개" : ""}</span>
                      <span className="mt-0.5 block overflow-hidden text-ellipsis whitespace-nowrap text-[#5f6368]">
                        {linkHost(link.url)}
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            </aside>
          </section>
        </main>
      </div>
      {previewScreenshot ? (
        <ScreenshotModal screenshot={previewScreenshot} onClose={() => setPreviewScreenshot(null)} />
      ) : null}
    </div>
  );
}
