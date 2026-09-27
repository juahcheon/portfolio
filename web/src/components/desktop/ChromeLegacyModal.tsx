"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useWindowDragOffset } from "@/hooks/useWindowDragOffset";
import { useWindowMinimize } from "@/hooks/useWindowMinimize";
import {
  FaArrowLeft,
  FaArrowRight,
  FaArrowRotateRight,
  FaEllipsisVertical,
  FaLock,
  FaRegStar,
  FaXmark,
} from "react-icons/fa6";
import type { GithubPinnedRepo } from "./githubPinnedRepos";
import { GitHubChromeContent } from "./GitHubChromeContent";
import { WinFrameTitleBar } from "./WinFrameTitleBar";
import { MobileChromeNavigation, type MobileProjectTabs } from "./MobileChromeNavigation";
import mobileStyles from "./MobileChrome.module.scss";

type Props = {
  projectTabs?: MobileProjectTabs;
  mobile?: boolean;
  compact?: boolean;
  windowId: string;
  zIndex: number;
  stackIndex?: number;
  /** `embeddedContent`가 없을 때만 사용 (iframe) */
  iframeUrl?: string;
  /** Chrome 본문 대신 렌더 (프로젝트 등). 있으면 iframe·차트 폴백을 쓰지 않음 */
  embeddedContent?: ReactNode;
  /** 주소창에 표시할 문자열 (없으면 iframeUrl) */
  displayAddressUrl?: string;
  /** github.com 은 iframe 차단 → 기여도 차트로 대체 */
  activityChartUrl?: string;
  profileUrl?: string;
  /** `github`: 라이트 테마 GitHub 프로필 UI. 기본 `chrome` */
  variant?: "chrome" | "github";
  /** `variant === "github"`일 때 프로필 영역 데이터 */
  githubMeta?: {
    username: string;
    avatarUrl: string;
    displayName: string;
    tagline: string;
    pinnedRepos: GithubPinnedRepo[];
  };
  /** 접근성 라벨 */
  ariaLabel?: string;
  /** 공통 흰색 타이틀 바 제목·아이콘 */
  titleBarTitle?: string;
  titleBarIconUrl?: string;
  onClose: () => void;
  onFocus: () => void;
  minimized?: boolean;
  onMinimize: () => void;
};

function isGitHubProfileEmbedBlocked(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host === "github.com";
  } catch {
    return false;
  }
}

export function ChromeLegacyModal({
  projectTabs,
  windowId,
  zIndex,
  stackIndex = 0,
  iframeUrl,
  embeddedContent,
  displayAddressUrl,
  activityChartUrl,
  profileUrl,
  variant = "chrome",
  githubMeta,
  ariaLabel = "Chrome",
  titleBarTitle,
  titleBarIconUrl,
  onClose,
  onFocus,
  minimized = false,
  onMinimize,
  mobile = false,
  compact = false,
}: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const windowRef = useWindowMinimize(windowId, minimized, !mobile);
  const [maximized, setMaximized] = useState(false);
  const toggleMaximized = () => setMaximized((current) => !current);
  const drag = useWindowDragOffset({
    disabled: mobile || maximized || minimized,
    onBegin: onFocus,
  });

  useEffect(() => {
    if (maximized) drag.resetOffset();
  }, [maximized, drag.resetOffset]);

  useEffect(() => { drag.resetOffset(); }, [mobile, compact, drag.resetOffset]);

  const showEmbedded = Boolean(embeddedContent);
  const useActivityFallback =
    !showEmbedded &&
    Boolean(activityChartUrl) &&
    typeof iframeUrl === "string" &&
    isGitHubProfileEmbedBlocked(iframeUrl);

  const stackX = compact ? 0 : stackIndex * 14;
  const stackY = compact ? 0 : stackIndex * 12;
  const positionStyle = mobile ? { zIndex, left: "env(safe-area-inset-left)", top: "env(safe-area-inset-top)", width: "calc(100% - env(safe-area-inset-left) - env(safe-area-inset-right))", height: "calc(var(--desktop-height) - var(--mobile-bar-height) - env(safe-area-inset-top))", transform: "none" } : maximized
    ? { zIndex }
    : {
        zIndex,
        transform: `translate(calc(-50% + min(${stackX}px, 50vw - 50% - 8px) + ${drag.offsetX}px), calc(-50% + min(${stackY}px, 50dvh - 50% - 50px) + ${drag.offsetY}px))`,
      };

  const modalClass =
    variant === "github" ? "clmPageModal clmPageModal--github" : "clmPageModal";

  return (
    <div
      ref={windowRef}
      className={`${modalClass} ${mobile && projectTabs ? mobileStyles.shell : ""} ${maximized && !mobile ? "clmPageModalMax" : ""}`}
      style={positionStyle}
      role="dialog"
      aria-label={ariaLabel}
      onMouseDown={onFocus}
    >
        {mobile && projectTabs ? <MobileChromeNavigation tabs={projectTabs} address={displayAddressUrl ?? "portfolio"} onTop={() => bodyRef.current?.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" })} onClose={onClose} /> : mobile || compact ? <WinFrameTitleBar mobile={mobile} compact={compact} title={titleBarTitle ?? ariaLabel} titleIconUrl={titleBarIconUrl} maximized={maximized} onTitleBarPointerDown={maximized ? undefined : drag.onTitleBarPointerDown} onMinimize={onMinimize} onClose={onClose} onMaximize={toggleMaximized} /> : <div className="clmModalHeader">
          <div
            className="clmHeaderPage"
            onPointerDown={maximized ? undefined : drag.onTitleBarPointerDown}
            onDoubleClick={(event) => {
              if ((event.target as Element).closest("button")) return;
              event.preventDefault();
              event.stopPropagation();
              toggleMaximized();
            }}
          >
            <div className="clmOpenPage">
              <ul>
                <li className="clmActivePage">
                  <a href="#" onClick={(e) => e.preventDefault()} tabIndex={-1}>
                    {titleBarIconUrl ? (
                      <Image
                        src={titleBarIconUrl}
                        alt=""
                        width={16}
                        height={16}
                        className="shrink-0 object-contain"
                        unoptimized
                      />
                    ) : null}
                    <span className="clmTabTitle">{titleBarTitle ?? ariaLabel}</span>
                  </a>
                  <button type="button" className={`clmExitPage clmHoverDark`} aria-label="탭 닫기">
                    <FaXmark aria-hidden />
                  </button>
                </li>
              </ul>
            </div>
            <div className="clmHeaderRight" onPointerDown={(e) => e.stopPropagation()}>
              <button type="button" className="clmMinimize" aria-label="최소화" title="최소화" onClick={onMinimize}>
                <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" aria-hidden>
                  <path d="M0 5.5h10" />
                </svg>
              </button>
              <button type="button" aria-label={maximized ? "이전 크기로" : "최대화"} title={maximized ? "이전 크기로" : "최대화"} onClick={toggleMaximized}>
                <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" aria-hidden>
                  {maximized ? (
                    <path d="M2.5 2V.5h7v7H8M.5 2.5h7v7h-7Z" />
                  ) : (
                    <rect x="0.5" y="0.5" width="9" height="9" />
                  )}
                </svg>
              </button>
              <button type="button" className="clmClose" aria-label="닫기" title="닫기" onClick={onClose}>
                <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" aria-hidden>
                  <path d="m.5.5 9 9m0-9-9 9" />
                </svg>
              </button>
            </div>
          </div>
          <div className="clmHeaderAddress">
            <div className="clmAddressMove">
              <button type="button" aria-label="뒤로">
                <FaArrowLeft aria-hidden />
              </button>
              <button type="button" aria-label="앞으로">
                <FaArrowRight aria-hidden />
              </button>
              <button type="button" aria-label="새로고침">
                <FaArrowRotateRight aria-hidden />
              </button>
            </div>
            <div className="clmAddressDetail">
              <button type="button" aria-label="보안">
                <FaLock aria-hidden />
              </button>
              <p className="clmAddressUrl">{displayAddressUrl ?? iframeUrl ?? ""}</p>
              <button type="button" aria-label="북마크">
                <FaRegStar aria-hidden />
              </button>
            </div>
            <button type="button" className={`clmSettingChrome clmHoverDark`} aria-label="설정">
              <FaEllipsisVertical aria-hidden />
            </button>
          </div>
        </div>
        }<div ref={bodyRef} className="clmModalBody">
          {showEmbedded ? (
            <div className="clmEmbeddedBody">{embeddedContent}</div>
          ) : useActivityFallback && activityChartUrl ? (
            variant === "github" && githubMeta && profileUrl ? (
              <GitHubChromeContent
                username={githubMeta.username}
                avatarUrl={githubMeta.avatarUrl}
                displayName={githubMeta.displayName}
                tagline={githubMeta.tagline}
                profileUrl={profileUrl}
                pinnedRepos={githubMeta.pinnedRepos}
              />
            ) : (
              <div className="clmActivityFallback">
                <Image
                  src={activityChartUrl}
                  alt="GitHub contribution activity"
                  width={800}
                  height={128}
                  className="clmActivityChart"
                  unoptimized
                />
                {profileUrl ? (
                  <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="clmActivityLink">
                    GitHub에서 프로필, Activity 열기
                  </a>
                ) : null}
              </div>
            )
          ) : iframeUrl ? (
            <iframe title="Chrome" src={iframeUrl} className="clmIframe" />
          ) : null}
        </div>
    </div>
  );
}
