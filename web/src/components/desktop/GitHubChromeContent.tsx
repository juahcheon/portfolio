"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaArrowRotateRight, FaArrowUpRightFromSquare, FaBook, FaBookOpen, FaLock, FaRegStar } from "react-icons/fa6";
import { SiGithub } from "react-icons/si";
import type { GithubPinnedRepo } from "./githubPinnedRepos";
import type { GithubContributions } from "@/lib/githubContributions";
import { contributionColors, GithubContributionGraph } from "./GithubContributionGraph";

type Props = {
  username: string;
  avatarUrl: string;
  displayName: string;
  tagline: string;
  profileUrl: string;
  pinnedRepos: GithubPinnedRepo[];
};

export function GitHubChromeContent({
  username, avatarUrl, displayName, tagline, profileUrl, pinnedRepos,
}: Props) {
  const [contributions, setContributions] = useState<GithubContributions | null>(null);
  const chartRequest = useRef<AbortController | null>(null);
  const [chartStatus, setChartStatus] = useState<"loading" | "ready" | "error">("loading");
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [repoAvatarFailures, setRepoAvatarFailures] = useState<Record<string, boolean>>({});
  const refreshChart = useCallback(async () => {
    chartRequest.current?.abort();
    const controller = new AbortController();
    chartRequest.current = controller;
    setChartStatus("loading");
    try {
      const response = await fetch("/api/github/contributions", { cache: "no-store", signal: controller.signal });
      if (!response.ok) throw new Error("Contribution request failed");
      const data: GithubContributions = await response.json();
      if (data.username !== username || !data.days?.length) throw new Error("Invalid contribution data");
      if (controller.signal.aborted) return;
      setContributions(data);
      setChartStatus("ready");
    } catch {
      if (!controller.signal.aborted) setChartStatus("error");
    }
  }, [username]);

  useEffect(() => {
    void refreshChart();
    return () => chartRequest.current?.abort();
  }, [refreshChart]);

  const external = { target: "_blank", rel: "noopener noreferrer" } as const;

  return (
    <div className="ghChromeRoot flex min-h-0 w-full flex-1 flex-col overflow-y-auto overflow-x-hidden bg-white text-base roomy:text-sm leading-relaxed text-[#1f2328]">
      <header className="flex items-center justify-between gap-4 border-b border-[#d1d9e0] bg-[#f6f8fa] px-6 py-4">
        <a href={profileUrl} {...external} className="inline-flex min-w-0 items-center gap-3 text-[#1f2328] no-underline">
          <SiGithub size={30} className="shrink-0" aria-hidden />
          <span className="truncate font-semibold">{username}</span>
        </a>
        <a href={profileUrl} {...external} className="inline-flex shrink-0 items-center gap-2 text-[13px] roomy:text-xs text-[#59636e] no-underline hover:text-[#0969da]">
          GitHub에서 보기 <FaArrowUpRightFromSquare aria-hidden />
        </a>
      </header>

      <nav aria-label="GitHub 프로필" className="flex shrink-0 gap-5 overflow-x-auto border-b border-[#d1d9e0] px-6 text-sm">
        <span aria-current="page" className="inline-flex items-center gap-2 whitespace-nowrap border-b-2 border-[#fd8c73] px-1 py-3 font-semibold">
          <FaBookOpen className="text-[#59636e]" aria-hidden /> Overview
        </span>
        <a href={`${profileUrl}?tab=repositories`} {...external} className="inline-flex items-center gap-2 whitespace-nowrap px-1 py-3 text-[#1f2328] no-underline hover:text-[#0969da]">
          <FaBook className="text-[#59636e]" aria-hidden /> Repositories
        </a>
        <a href={`${profileUrl}?tab=stars`} {...external} className="inline-flex items-center gap-2 whitespace-nowrap px-1 py-3 text-[#1f2328] no-underline hover:text-[#0969da]">
          <FaRegStar className="text-[#59636e]" aria-hidden /> Stars
        </a>
      </nav>

      <div className="grid gap-7 p-4 roomy:p-6 roomy:grid-cols-[minmax(160px,220px)_minmax(0,1fr)]">
        <aside className="min-w-0">
          <a href={profileUrl} {...external} aria-label={`${username} GitHub 프로필`} className="block w-36 max-w-full roomy:w-full">
            {avatarFailed ? (
              <span className="flex aspect-square items-center justify-center rounded-full border border-[#d1d9e0] bg-[#f6f8fa] text-5xl text-[#59636e]">{username.slice(0, 1).toUpperCase()}</span>
            ) : (
              <Image src={avatarUrl} alt={`${username} 프로필 사진`} width={220} height={220} unoptimized onError={() => setAvatarFailed(true)} className="aspect-square h-auto w-full rounded-full border border-[#d1d9e0] bg-[#f6f8fa]" />
            )}
          </a>
          <h2 className="m-0 mt-4 text-2xl font-semibold leading-tight">{displayName}</h2>
          <p className="m-0 mt-1 text-xl font-light text-[#59636e]">{username}</p>
          <p className="m-0 mt-4 text-base">{tagline}</p>
          <a href={profileUrl} {...external} className="mt-4 flex items-center justify-center gap-2 rounded-md border border-[#d1d9e0] bg-[#f6f8fa] px-3 py-1.5 min-h-11 roomy:min-h-0 font-medium text-[#25292e] no-underline shadow-sm hover:bg-[#eff2f5]">
            <SiGithub aria-hidden /> 프로필 보기
          </a>
        </aside>

        <div className="min-w-0 space-y-7">
          {pinnedRepos.length > 0 ? (
            <section aria-label="주요 저장소">
              <h3 className="m-0 mb-3 text-base font-normal">주요 저장소</h3>
              <ul className="m-0 grid list-none gap-4 p-0 roomy:grid-cols-2">
                {pinnedRepos.map((repo) => (
                  <li key={repo.url} className="flex min-w-0 flex-col rounded-md border border-[#d1d9e0] p-4">
                    <div className="flex items-start gap-2">
                      {repo.avatarUrl && !repoAvatarFailures[repo.url] ? (
                        <Image src={repo.avatarUrl} alt={`${repo.name} organization 프로필 이미지`} width={24} height={24} unoptimized className="h-6 w-6 shrink-0 rounded border border-[#d1d9e0] object-contain" onError={() => setRepoAvatarFailures((previous) => ({ ...previous, [repo.url]: true }))} />
                      ) : repo.visibility === "private" ? <FaLock className="mt-1 shrink-0 text-[#59636e]" aria-hidden /> : <FaBook className="mt-1 shrink-0 text-[#59636e]" aria-hidden />}
                      <a href={repo.url} {...external} className="min-w-0 break-words font-semibold text-[#0969da] no-underline hover:underline">{repo.name}</a>
                      <span className="ml-auto shrink-0 rounded-full border border-[#d1d9e0] px-1.5 text-[13px] roomy:text-xs leading-5 text-[#59636e]">
                        {repo.visibility === "private" ? "Private" : repo.visibility === "website" ? "Website" : "Public"}
                      </span>
                    </div>
                    <p className="m-0 mt-2 roomy:line-clamp-2 text-[16px] roomy:text-xs leading-relaxed text-[#59636e]">{repo.description}</p>
                    {repo.visibility === "private" ? <p className="m-0 mt-2 text-[13px] roomy:text-xs text-[#59636e]">비공개 저장소, 접근 권한 필요</p> : null}
                    {repo.language ? <p className="m-0 mt-auto flex items-center gap-1.5 pt-4 text-[13px] roomy:text-xs text-[#59636e]">
                      <span className={`h-3 w-3 rounded-full ${repo.language === "JavaScript" ? "bg-[#f1e05a]" : repo.language === "TypeScript" ? "bg-[#3178c6]" : "bg-[#858585]"}`} aria-hidden />
                      {repo.language}
                    </p> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section aria-label="GitHub 기여 활동">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="m-0 text-base font-normal">최근 1년 기여 활동</h3>
              <button type="button" onClick={refreshChart} disabled={chartStatus === "loading"} className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-[#d1d9e0] bg-[#f6f8fa] px-2 py-1 min-h-11 roomy:min-h-0 text-[13px] roomy:text-xs text-[#59636e] hover:bg-[#eff2f5] disabled:cursor-wait disabled:opacity-60">
                <FaArrowRotateRight aria-hidden /> 잔디 새로고침
              </button>
            </div>
            <div className="rounded-md border border-[#d1d9e0] p-4" aria-busy={chartStatus === "loading"}>
              {chartStatus === "loading" ? <p role="status" className="m-0 mb-2 text-[13px] roomy:text-xs text-[#59636e]">기여 활동을 불러오는 중입니다.</p> : null}
              {chartStatus === "error" ? (
                <p role="status" className="m-0 text-sm text-[#59636e]">기여 활동을 불러오지 못했습니다. 새로고침하거나 GitHub에서 확인해 주세요.</p>
              ) : contributions && chartStatus === "ready" ? (
                <GithubContributionGraph key={contributions.days[0].date} days={contributions.days} />
              ) : null}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[13px] roomy:text-xs text-[#59636e]">
                <a href={profileUrl} {...external} className="text-[#59636e] no-underline hover:text-[#0969da] hover:underline">GitHub에서 기여 활동 보기</a>
                <div className="flex items-center gap-1" aria-label="기여 활동 색상: 적음에서 많음">
                  <span className="mr-1">Less</span>
                  {contributionColors.map((color) => <span key={color} className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} aria-hidden />)}
                  <span className="ml-1">More</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
