"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { FaFolder } from "react-icons/fa6";
import type { OpenWindow } from "@/store/desktopStore";
import type { PortfolioPayload } from "@/types/portfolio";
import { WinExplorerHeader } from "@/components/explorer/WinExplorerHeader";
import { pickGithubPinnedRepos } from "./githubPinnedRepos";
import { WindowContents } from "./WindowContents";

const ChromeLegacyModal = dynamic(
  () => import("./ChromeLegacyModal").then((m) => m.ChromeLegacyModal),
  { ssr: false }
);
const WordAppWindow = dynamic(
  () => import("@/components/word/WordAppWindow").then((m) => m.WordAppWindow),
  { ssr: false }
);
const RecycleBinExplorerView = dynamic(
  () => import("@/components/explorer/RecycleBinExplorerView").then((m) => m.RecycleBinExplorerView),
  { ssr: false }
);
const ThisPcExplorerView = dynamic(
  () => import("@/components/explorer/ThisPcExplorerView").then((m) => m.ThisPcExplorerView),
  { ssr: false }
);
const SkillsExplorerView = dynamic(
  () => import("@/components/explorer/SkillsExplorerView").then((m) => m.SkillsExplorerView),
  { ssr: false }
);
const ProjectsPanelView = dynamic(
  () => import("@/components/explorer/ProjectsPanelView").then((m) => m.ProjectsPanelView),
  { ssr: false }
);

function RecycleBinTitleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path fill="#8d8d8d" d="M5 2h6l1 1h3v2H1V3h3l1-1z" />
      <path fill="#c4c4c4" d="M2 5h12v9H2V5zm1 1v7h10V6H3z" />
      <path fill="#6b6b6b" d="M6 8h4v1H6V8zm0 2h3v1H6v-1z" />
    </svg>
  );
}

function MyPcTitleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <rect x="2" y="3" width="12" height="10" rx="1" fill="#e8e8e8" stroke="#9a9a9a" strokeWidth="1" />
      <rect x="4" y="5" width="8" height="6" fill="#c4c4c4" />
      <rect x="6" y="12" width="4" height="2" fill="#9a9a9a" />
    </svg>
  );
}

function DefaultExplorerIcon() {
  return <FaFolder className="text-[15px] text-[#e8b931]" aria-hidden />;
}

type Props = {
  win: OpenWindow;
  data: PortfolioPayload;
  zIndex: number;
  stackIndex: number;
  isActive: boolean;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
};

function isExplorerShell(kind: OpenWindow["kind"]) {
  return kind === "recycle" || kind === "thisPc" || kind === "skills";
}

function titleLeading(win: OpenWindow) {
  if (win.kind === "recycle") return <RecycleBinTitleIcon />;
  if (win.kind === "thisPc") return <MyPcTitleIcon />;
  return <DefaultExplorerIcon />;
}

function minimizedLeading(win: OpenWindow) {
  return titleLeading(win);
}

export function WinWindow({ win, data, zIndex, stackIndex, isActive, onClose, onFocus }: Props) {
  const [maximized, setMaximized] = useState(false);
  const [minimized, setMinimized] = useState(false);

  if (win.kind === "projects") {
    return (
      <ChromeLegacyModal
        zIndex={zIndex}
        stackIndex={stackIndex}
        embeddedContent={<ProjectsPanelView projects={data.projects} />}
        displayAddressUrl="portfolio://projects"
        ariaLabel="프로젝트"
        onClose={() => onClose(win.id)}
        onFocus={() => onFocus(win.id)}
      />
    );
  }

  if (win.kind === "github") {
    const gh = data.github;
    return (
      <ChromeLegacyModal
        zIndex={zIndex}
        stackIndex={stackIndex}
        iframeUrl={gh.profileUrl}
        displayAddressUrl="https://github.com/juahcheon"
        activityChartUrl={gh.chartImageUrl}
        profileUrl={gh.profileUrl}
        variant="github"
        githubMeta={{
          username: gh.username,
          displayName: data.profile.name,
          tagline: data.profile.headlineLines[0] ?? data.profile.title,
          pinnedRepos: pickGithubPinnedRepos(data.projects),
        }}
        ariaLabel="GitHub"
        onClose={() => onClose(win.id)}
        onFocus={() => onFocus(win.id)}
      />
    );
  }

  if (minimized) {
    return (
      <button
        type="button"
        className="fixed bottom-[52px] flex h-8 min-w-[168px] max-w-[220px] cursor-pointer items-center gap-2 border border-[#a0a0a0] bg-white px-2.5 text-left font-sans text-xs text-black shadow-md hover:bg-[#f0f0f0]"
        style={{
          zIndex,
          left: `max(8px, calc(50% - 90px + ${stackIndex * 168}px))`,
        }}
        title="복원"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => {
          setMinimized(false);
          onFocus(win.id);
        }}
      >
        {win.taskbarIconUrl ? (
          <Image
            src={win.taskbarIconUrl}
            alt=""
            width={16}
            height={16}
            className="h-4 w-4 shrink-0 object-contain"
            unoptimized
          />
        ) : (
          minimizedLeading(win)
        )}
        <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{win.title}</span>
      </button>
    );
  }

  const explorer = isExplorerShell(win.kind);
  const isWordDoc = win.kind === "about";
  const isCursorWin = win.kind === "cursor";
  const stackX = stackIndex * 14;
  const stackY = stackIndex * 12;

  const sizeStyle = maximized
    ? {
        left: 0,
        top: 0,
        width: "100%",
        height: "calc(100vh - 50px)",
        transform: "none",
      }
    : {
        left: "50%",
        top: "50%",
        width: isWordDoc
          ? "min(96vw, 920px)"
          : explorer
            ? "min(92vw, 700px)"
            : "min(92vw, 760px)",
        height: isWordDoc
          ? "min(92vh, 780px, calc(100vh - 100px))"
          : explorer
            ? "min(76vh, 520px)"
            : "min(78vh, min(640px, calc(100vh - 70px)))",
        transform: `translate(calc(-50% + ${stackX}px), calc(-50% + ${stackY}px))`,
      };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={win.title}
      onMouseDown={() => onFocus(win.id)}
      className={`fixed flex flex-col overflow-hidden border border-[#a0a0a0] bg-white shadow-win ${
        isCursorWin && !maximized ? "rounded-[10px]" : ""
      } ${isActive ? "outline outline-2 outline-[rgba(0,120,212,0.55)] outline-offset-0" : ""}`}
      style={{
        zIndex,
        ...sizeStyle,
      }}
    >
      {isWordDoc ? (
        <WordAppWindow
          data={data}
          maximized={maximized}
          onMinimize={() => setMinimized(true)}
          onMaximize={() => setMaximized((m) => !m)}
          onClose={() => onClose(win.id)}
        />
      ) : (
        <>
          <WinExplorerHeader
            title={win.title}
            titleIconUrl={win.taskbarIconUrl}
            leading={titleLeading(win)}
            maximized={maximized}
            onMinimize={() => setMinimized(true)}
            onMaximize={() => setMaximized((m) => !m)}
            onClose={() => onClose(win.id)}
          />

          {win.kind === "recycle" ? (
            <RecycleBinExplorerView />
          ) : win.kind === "thisPc" ? (
            <ThisPcExplorerView />
          ) : win.kind === "skills" ? (
            <SkillsExplorerView skills={data.skills} />
          ) : (
            <div className="min-h-0 flex-1 overflow-auto p-4 text-sm text-neutral-800">
              <WindowContents win={win} data={data} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
