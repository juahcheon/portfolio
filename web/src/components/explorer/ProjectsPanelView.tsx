"use client";

import { useMemo, useState } from "react";
import { FaBolt, FaCodeBranch, FaLink, FaShieldHalved, FaTriangleExclamation } from "react-icons/fa6";
import type { Project, PortfolioPayload, StructuredTroubleshootingItem } from "@/types/portfolio";

function isStructured(item: unknown): item is StructuredTroubleshootingItem {
  return typeof item === "object" && item !== null && "발단" in item;
}

type Props = {
  projects: PortfolioPayload["projects"];
};

const COPY = {
  title: "\ud504\ub85c\uc81d\ud2b8",
  auditSummary: "\ud504\ub85c\uc81d\ud2b8\uc758 \uad6c\uc870, \uc6b4\uc601 \ud658\uacbd, \ubb38\uc81c \ud574\uacb0 \uacfc\uc815\uc744 \ud655\uc778\ud558\ub294 \ub9ac\ud3ec\ud2b8",
  projectList: "\ud504\ub85c\uc81d\ud2b8 \ubaa9\ub85d",
  implemented: "\uae30\ub2a5",
  stack: "Stack",
  troubleshooting: "Troubleshooting",
  links: "Links",
  current: "\uc9c4\ud589\uc911\uc778 \ud504\ub85c\uc81d\ud2b8",
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
  if (project.slug === "dshelper") return COPY.current;
  if (project.slug === "portfolio") return COPY.personal;
  return project.team;
}

function sidebarStatus(project: Project) {
  if (project.slug === "dshelper") return COPY.teamProject;
  return projectStatus(project);
}

export function ProjectsPanelView({ projects }: Props) {
  const [selectedSlug, setSelectedSlug] = useState(() => projects[0]?.slug ?? "");
  const selectedProject = useMemo(
    () => projects.find((project) => project.slug === selectedSlug) ?? projects[0],
    [projects, selectedSlug]
  );

  if (!selectedProject) {
    return null;
  }

  const accent = projectColor(selectedProject);
  const selectedTags = uniqueTags([
    ...stackTags(selectedProject.stackSummary),
    ...selectedProject.env.split(",").map((tag) => tag.trim()).filter(Boolean),
  ]);

  return (
    <div className="flex min-h-full flex-col bg-white text-[#202124]">
      <header className="border-b border-[#e8eaed] px-6 py-5">
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="m-0 text-[28px] font-semibold leading-tight text-[#202124]">{COPY.title}</h2>
            <p className="m-0 mt-1 text-sm text-[#5f6368]">{COPY.auditSummary}</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#dadce0] bg-[#f8fafd] px-3 py-1.5 text-xs text-[#3c4043]">
            <FaShieldHalved aria-hidden className="text-[#5f6368]" />
            <span>프로젝트 {projects.length}개</span>
          </div>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[20fr_80fr]">
        <aside className="border-b border-[#e8eaed] bg-[#f8fafd] p-2 lg:border-b-0 lg:border-r" aria-label={COPY.projectList}>
          <div className="space-y-2">
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
                  onClick={() => setSelectedSlug(project.slug)}
                >
                  <span className="block text-sm font-semibold text-[#202124]">{project.name}</span>
                  <span className="mt-1 block text-xs text-[#5f6368]">{sidebarStatus(project)}</span>
                  <span className="mt-2 flex items-center gap-1.5 text-[11px] text-[#70757a]">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} aria-hidden />
                    {project.slug}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="min-h-0 overflow-auto p-7 pb-10">
          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_270px]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full px-2.5 py-1 text-xs font-medium text-white" style={{ backgroundColor: accent }}>
                  {projectStatus(selectedProject)}
                </span>
                {selectedProject.contribution ? (
                  <span className="rounded-full border border-[#dadce0] px-2.5 py-1 text-xs text-[#5f6368]">
                    {COPY.contribution} {selectedProject.contribution}
                  </span>
                ) : null}
              </div>

              <h3 className="m-0 mt-3 text-2xl font-semibold leading-tight" style={{ color: accent }}>
                {selectedProject.name}
              </h3>
              <p className="m-0 mt-2 text-base leading-relaxed text-[#4d5156]">{selectedProject.description}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {(selectedProject.details ?? []).map((detail) => (
                  <div key={detail.label} className="rounded border border-[#e8eaed] bg-white p-3 shadow-[0_1px_2px_rgba(60,64,67,0.08)]">
                    <p className="m-0 flex items-center gap-2 text-xs font-semibold text-[#3c4043]">
                      <FaBolt aria-hidden style={{ color: accent }} />
                      {detail.label}
                    </p>
                    <p className="m-0 mt-2 text-sm leading-relaxed text-[#5f6368]">{detail.value}</p>
                  </div>
                ))}
              </div>

              {selectedProject.features && selectedProject.features.length > 0 ? (
                <section className="mt-5 rounded border border-[#e8eaed] bg-white p-4 shadow-[0_1px_2px_rgba(60,64,67,0.08)]">
                  <div className="flex items-center gap-2">
                    <FaCodeBranch aria-hidden style={{ color: accent }} />
                    <h4 className="m-0 text-sm font-semibold text-[#202124]">{COPY.implemented}</h4>
                  </div>
                  <ul className="m-0 mt-3 list-none space-y-2 p-0">
                    {selectedProject.features.map((feature) => (
                      <li key={feature} className="flex gap-2 text-base leading-relaxed text-[#4d5156]">
                        <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} aria-hidden />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <section className="mb-5 mt-5 rounded border bg-[#fbfcfd] p-4" style={{ borderColor: accent }}>
                <div className="flex items-center gap-2">
                  <FaTriangleExclamation aria-hidden style={{ color: accent }} />
                  <h4 className="m-0 text-sm font-semibold text-[#202124]">{COPY.troubleshooting}</h4>
                </div>
                <ol className="m-0 mt-3 list-none space-y-4 p-0">
                  {(selectedProject.troubleshooting ?? []).map((item, index) => (
                    <li key={index} className="grid grid-cols-[22px_minmax(0,1fr)] gap-2">
                      <span
                        className="mt-[3px] flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                        style={{ backgroundColor: accent }}
                        aria-hidden
                      >
                        {index + 1}
                      </span>
                      {isStructured(item) ? (
                        <div className="space-y-2 text-sm leading-relaxed text-[#4d5156]">
                          {(["발단", "전개", "해결"] as const).map((label) => (
                            <div key={label} className="flex gap-2">
                              <span
                                className="mt-0.5 shrink-0 rounded-xl border px-2 py-0.5 text-[11px] font-semibold"
                                style={{ borderColor: accent, color: accent }}
                              >
                                {label}
                              </span>
                              <p className="m-0">{item[label]}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-base leading-relaxed text-[#4d5156]">{item}</span>
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
                  <h4 className="m-0 text-sm font-semibold text-[#202124]">{COPY.stack}</h4>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selectedTags.map((tag) => (
                    <span
                      key={`${selectedProject.slug}-${tag}`}
                      className="rounded border border-[#dadce0] bg-[#f8fafd] px-2 py-1 text-sm text-[#3c4043]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>

              <section className="rounded border border-[#e8eaed] bg-white p-4 shadow-[0_1px_2px_rgba(60,64,67,0.08)]">
                <div className="flex items-center gap-2">
                  <FaLink aria-hidden className="text-[#5f6368]" />
                  <h4 className="m-0 text-sm font-semibold text-[#202124]">{COPY.links}</h4>
                </div>
                <div className="mt-3 space-y-2">
                  {selectedProject.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded border border-[#dfe1e5] bg-white px-3 py-2 text-sm text-[#1a0dab] underline-offset-2 hover:bg-[#f8fafd] hover:underline"
                    >
                      <span className="block font-medium">{link.label}</span>
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
    </div>
  );
}
