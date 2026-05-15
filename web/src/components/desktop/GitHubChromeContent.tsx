"use client";

import Image from "next/image";
import type { GithubPinnedRepo } from "./githubPinnedRepos";

type Props = {
  username: string;
  displayName: string;
  tagline: string;
  profileUrl: string;
  activityChartUrl: string;
  pinnedRepos: GithubPinnedRepo[];
};

export function GitHubChromeContent({
  username,
  displayName,
  tagline,
  profileUrl,
  activityChartUrl,
  pinnedRepos,
}: Props) {
  const initial = username.slice(0, 1).toUpperCase();

  return (
    <div className="ghChromeRoot flex min-h-0 w-full flex-1 flex-col overflow-y-auto overflow-x-hidden bg-[#0d1117] text-[14px] leading-relaxed text-[#d1d9e0]">
      <div className="border-b border-[#30363d] px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-start gap-4">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-[#30363d] bg-[#21262d] text-3xl font-semibold text-[#b1bac4]"
            aria-hidden
          >
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="m-0 text-2xl font-semibold leading-tight text-[#f0f6fc]">{displayName}</h2>
              <span className="text-xl font-light text-[#b1bac4]">@{username}</span>
            </div>
            <p className="mt-2 max-w-xl text-[#b1bac4]">{tagline}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#f0f6fc] no-underline hover:border-[#58a6ff] hover:bg-[#30363d]"
              >
                <i className="fa-brands fa-github text-[#e6edf3]" aria-hidden />
                프로필로 이동
              </a>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[#30363d] px-3 py-1 text-xs text-[#b1bac4]">
                <i className="fa-solid fa-location-dot" aria-hidden />
                Portfolio
              </span>
            </div>
          </div>
        </div>

        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#21262d] pt-4 text-sm">
          <div className="flex items-center gap-2">
            <dt className="m-0 text-[#b1bac4]">
              <i className="fa-solid fa-book-bookmark mr-1" aria-hidden />
              Repos
            </dt>
            <dd className="m-0 font-semibold text-[#f0f6fc]">{12 + pinnedRepos.length}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="m-0 text-[#b1bac4]">
              <i className="fa-regular fa-star mr-1" aria-hidden />
              Stars
            </dt>
            <dd className="m-0 font-semibold text-[#f0f6fc]">—</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="m-0 text-[#b1bac4]">
              <i className="fa-solid fa-user-group mr-1" aria-hidden />
              Followers
            </dt>
            <dd className="m-0 font-semibold text-[#f0f6fc]">—</dd>
          </div>
        </dl>
      </div>

      {pinnedRepos.length > 0 ? (
        <section className="border-b border-[#30363d] px-4 py-4 sm:px-6">
          <h3 className="m-0 mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#b1bac4]">
            <i className="fa-solid fa-thumbtack rotate-45 text-[10px] opacity-80" aria-hidden />
            Pinned
          </h3>
          <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
            {pinnedRepos.map((repo) => (
              <li key={repo.url} className="min-w-0">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-md border border-[#30363d] bg-[#161b22] p-3 no-underline transition-colors hover:border-[#58a6ff]"
                >
                  <div className="flex items-start gap-2">
                    <i className="fa-solid fa-book mt-0.5 shrink-0 text-[#b1bac4]" aria-hidden />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-[#79c0ff]">{repo.name}</div>
                      <p className="mt-1 line-clamp-2 text-xs text-[#b1bac4]">{repo.description}</p>
                      <div className="mt-2 flex items-center gap-2 text-[11px] text-[#b1bac4]">
                        <span className="inline-flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-[#3178c6]" aria-hidden />
                          {repo.language}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="flex flex-1 flex-col gap-3 px-4 py-4 sm:px-6">
        <h3 className="m-0 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#b1bac4]">
          <i className="fa-solid fa-chart-simple" aria-hidden />
          Contributions
        </h3>
        <div className="overflow-hidden rounded-md border border-[#30363d] bg-[#161b22] p-2">
          <Image
            src={activityChartUrl}
            alt="GitHub contribution graph"
            width={800}
            height={128}
            className="h-auto max-w-full"
            unoptimized
          />
        </div>
      </section>
    </div>
  );
}
