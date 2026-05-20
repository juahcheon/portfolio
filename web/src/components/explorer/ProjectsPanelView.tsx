"use client";

import type { PortfolioPayload } from "@/types/portfolio";

type Props = {
  projects: PortfolioPayload["projects"];
};

export function ProjectsPanelView({ projects }: Props) {
  return (
    <div className="space-y-6">
      <p className="m-0 text-sm leading-relaxed text-neutral-600">
        대표 프로젝트 요약입니다. 링크는 새 탭에서 열립니다.
      </p>
      <ul className="m-0 list-none space-y-5 p-0">
        {projects.map((p) => (
          <li
            key={p.slug}
            className="rounded border border-neutral-200 bg-neutral-50/80 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="m-0 text-base font-semibold text-neutral-900">{p.name}</h3>
              <span className="text-xs text-neutral-500">
                {p.role} · {p.team} · 기여 {p.contribution}
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-600">
              <span className="font-medium text-neutral-700">스택</span> {p.stackSummary}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-800">{p.description}</p>
            {p.links.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {p.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded border border-winBlue/40 bg-white px-2.5 py-1 text-xs font-medium text-winBlue underline-offset-2 hover:bg-[#f0f6ff] hover:underline"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
