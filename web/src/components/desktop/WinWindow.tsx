"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useWindowDragOffset } from "@/hooks/useWindowDragOffset";
import { useWindowMinimize } from "@/hooks/useWindowMinimize";
import { FaFolder } from "react-icons/fa6";
import { useDesktopStore, type OpenWindow } from "@/store/desktopStore";
import type { PortfolioPayload } from "@/types/portfolio";
import { WinFrameTitleBar } from "@/components/desktop/WinFrameTitleBar";
import { pickGithubPinnedRepos } from "./githubPinnedRepos";
import { CmdTerminal } from "./CmdTerminal";

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
  mobile?: boolean;
  compact?: boolean;
  win: OpenWindow;
  data: PortfolioPayload;
  zIndex: number;
  stackIndex: number;
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

export function WinWindow({ win, data, zIndex, stackIndex, onClose, onFocus, mobile = false, compact = false }: Props) {
  const [maximized, setMaximized] = useState(false);
  const minimized = win.minimized ?? false;
  const windowRef = useWindowMinimize(win.id, minimized, !mobile);
  const minimizeWindow = useDesktopStore((s) => s.minimizeWindow);
  const openWindow = useDesktopStore((s) => s.openWindow);
  const isChromeShell = win.kind === "projects" || win.kind === "github";
  const drag = useWindowDragOffset({
    disabled: mobile || minimized || (!isChromeShell && maximized),
    onBegin: () => onFocus(win.id),
  });

  useEffect(() => {
    if (!isChromeShell && maximized) drag.resetOffset();
  }, [isChromeShell, maximized, drag.resetOffset]);

  useEffect(() => { drag.resetOffset(); }, [mobile, compact, drag.resetOffset]);

  if (win.kind === "projects") {
    return (
      <ChromeLegacyModal
        mobile={mobile}
        compact={compact}
        zIndex={zIndex}
        stackIndex={stackIndex}
        embeddedContent={<ProjectsPanelView mobile={compact} projects={data.projects} selectedProjectSlug={win.projectSlug} onProjectSelect={(projectSlug) => openWindow({ ...win, projectSlug })} />}
        projectTabs={{ projects: data.projects, selectedSlug: win.projectSlug, onSelect: (projectSlug) => openWindow({ ...win, projectSlug }) }}
        windowId={win.id}
        minimized={minimized}
        onMinimize={() => minimizeWindow(win.id)}
        displayAddressUrl={`https://portfolio/projects?q=${win.projectSlug ?? data.projects[0]?.slug ?? "portfolio"}`}
        ariaLabel={win.title}
        titleBarTitle={win.title}
        titleBarIconUrl={win.taskbarIconUrl ?? "/icons/desktop/chromeIcon.svg"}
        onClose={() => onClose(win.id)}
        onFocus={() => onFocus(win.id)}
      />
    );
  }

  if (win.kind === "github") {
    const gh = data.github;
    return (
      <ChromeLegacyModal
        mobile={mobile}
        compact={compact}
        zIndex={zIndex}
        stackIndex={stackIndex}
        iframeUrl={gh.profileUrl}
        windowId={win.id}
        minimized={minimized}
        onMinimize={() => minimizeWindow(win.id)}
        displayAddressUrl={gh.profileUrl}
        activityChartUrl={gh.chartImageUrl}
        profileUrl={gh.profileUrl}
        variant="github"
        githubMeta={{
          username: gh.username,
          avatarUrl: gh.avatarUrl,
          displayName: data.profile.name,
          tagline: data.profile.headlineLines[0] ?? data.profile.title,
          pinnedRepos: pickGithubPinnedRepos(data.projects),
        }}
        ariaLabel="GitHub"
        titleBarTitle={win.title}
        titleBarIconUrl={win.taskbarIconUrl ?? "/img/webp/github.webp"}
        onClose={() => onClose(win.id)}
        onFocus={() => onFocus(win.id)}
      />
    );
  }

  const explorer = isExplorerShell(win.kind);
  const isWordDoc = win.kind === "about";
  const isCmdWin = win.kind === "cmd";
  const stackX = compact ? 0 : stackIndex * 14;
  const stackY = compact ? 0 : stackIndex * 12;

  const sizeStyle = mobile ? { left: "env(safe-area-inset-left)", top: "env(safe-area-inset-top)", width: "calc(100% - env(safe-area-inset-left) - env(safe-area-inset-right))", height: "calc(var(--desktop-height) - var(--mobile-bar-height) - env(safe-area-inset-top))", transform: "none" } : maximized
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
        transform: `translate(calc(-50% + min(${stackX}px, 50vw - 50% - 8px) + ${drag.offsetX}px), calc(-50% + min(${stackY}px, 50dvh - 50% - 50px) + ${drag.offsetY}px))`,
      };

  return (
    <div
      ref={windowRef}
      role="dialog"
      aria-modal="false"
      aria-label={win.title}
      onMouseDown={() => onFocus(win.id)}
      className={`mobile-app-window fixed flex flex-col overflow-hidden border border-[#a0a0a0] bg-white shadow-win ${
        isCmdWin ? "rounded-none" : ""
      }`}
      style={{
        zIndex,
        ...sizeStyle,
      }}
    >
      {isWordDoc ? (
        <>
          {!mobile && <WinFrameTitleBar
            mobile={mobile}
            compact={compact}
            title={win.title}
            titleIconUrl={win.taskbarIconUrl}
            maximized={maximized}
            onTitleBarPointerDown={maximized ? undefined : drag.onTitleBarPointerDown}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={() => setMaximized((m) => !m)}
            onClose={() => onClose(win.id)}
          />}
          <WordAppWindow data={data} mobile={mobile} />
        </>
      ) : (
        <>
          {!(mobile && win.kind === "skills") && <WinFrameTitleBar
            mobile={mobile}
            compact={compact}
            title={win.title}
            titleIconUrl={win.taskbarIconUrl}
            leading={titleLeading(win)}
            maximized={maximized}
            onTitleBarPointerDown={maximized ? undefined : drag.onTitleBarPointerDown}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={() => setMaximized((m) => !m)}
            onClose={() => onClose(win.id)}
          />}

          {win.kind === "recycle" ? (
            <RecycleBinExplorerView />
          ) : win.kind === "thisPc" ? (
            <ThisPcExplorerView />
          ) : win.kind === "skills" ? (
            <SkillsExplorerView skills={data.skills} mobile={mobile} />
          ) : win.kind === "cmd" ? (
            <CmdTerminal data={data} mobile={mobile} />
          ) : null}
        </>
      )}
    </div>
  );
}
