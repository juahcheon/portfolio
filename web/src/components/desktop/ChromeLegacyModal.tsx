"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useWindowDragOffset } from "@/hooks/useWindowDragOffset";
import {
  FaArrowLeft,
  FaArrowRight,
  FaArrowRotateRight,
  FaEllipsisVertical,
  FaLock,
  FaMinus,
  FaRegSquare,
  FaRegStar,
  FaXmark,
} from "react-icons/fa6";
import type { GithubPinnedRepo } from "./githubPinnedRepos";
import { GitHubChromeContent } from "./GitHubChromeContent";

type Props = {
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
  /** `github`: 본문·주소줄 다크 + GitHub UI. 기본 `chrome` */
  variant?: "chrome" | "github";
  /** `variant === "github"`일 때 프로필 영역 데이터 */
  githubMeta?: {
    username: string;
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
}: Props) {
  const [maximized, setMaximized] = useState(false);
  const drag = useWindowDragOffset({
    disabled: maximized,
    onBegin: onFocus,
  });

  useEffect(() => {
    if (maximized) drag.resetOffset();
  }, [maximized, drag.resetOffset]);

  const showEmbedded = Boolean(embeddedContent);
  const useActivityFallback =
    !showEmbedded &&
    Boolean(activityChartUrl) &&
    typeof iframeUrl === "string" &&
    isGitHubProfileEmbedBlocked(iframeUrl);

  const stackX = stackIndex * 14;
  const stackY = stackIndex * 12;
  const positionStyle = maximized
    ? { zIndex }
    : {
        zIndex,
        transform: `translate(calc(-50% + ${stackX + drag.offsetX}px), calc(-50% + ${stackY + drag.offsetY}px))`,
      };

  const modalClass =
    variant === "github" ? "clmPageModal clmPageModal--github" : "clmPageModal";

  return (
    <div
      className={`${modalClass} ${maximized ? "clmPageModalMax" : ""}`}
      style={positionStyle}
      role="dialog"
      aria-label={ariaLabel}
      onMouseDown={onFocus}
    >
        <div className="clmModalHeader">
          <div
            className="clmHeaderPage"
            onPointerDown={maximized ? undefined : drag.onTitleBarPointerDown}
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
              <button type="button" className="clmMinimize" aria-label="최소화" onClick={() => {}}>
                <FaMinus aria-hidden />
              </button>
              <button type="button" aria-label={maximized ? "이전 크기로" : "최대화"} onClick={() => setMaximized((m) => !m)}>
                <FaRegSquare aria-hidden />
              </button>
              <button type="button" aria-label="닫기" onClick={onClose}>
                <FaXmark aria-hidden />
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
        <div className="clmModalBody">
          {showEmbedded ? (
            <div className="clmEmbeddedBody">{embeddedContent}</div>
          ) : useActivityFallback && activityChartUrl ? (
            variant === "github" && githubMeta && profileUrl ? (
              <GitHubChromeContent
                username={githubMeta.username}
                displayName={githubMeta.displayName}
                tagline={githubMeta.tagline}
                profileUrl={profileUrl}
                activityChartUrl={activityChartUrl}
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
                    GitHub에서 프로필·Activity 열기
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
