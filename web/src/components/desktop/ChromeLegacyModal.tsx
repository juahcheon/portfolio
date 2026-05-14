"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  zIndex: number;
  stackIndex?: number;
  iframeUrl: string;
  /** 주소창에 표시할 문자열 (없으면 iframeUrl) */
  displayAddressUrl?: string;
  /** github.com 은 iframe 차단 → 기여도 차트로 대체 */
  activityChartUrl?: string;
  profileUrl?: string;
  /** 접근성 라벨 */
  ariaLabel?: string;
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
  displayAddressUrl,
  activityChartUrl,
  profileUrl,
  ariaLabel = "Chrome",
  onClose,
  onFocus,
}: Props) {
  const [maximized, setMaximized] = useState(false);

  const useActivityFallback =
    Boolean(activityChartUrl) && isGitHubProfileEmbedBlocked(iframeUrl);

  const stackX = stackIndex * 14;
  const stackY = stackIndex * 12;
  const positionStyle = maximized
    ? { zIndex }
    : {
        zIndex,
        transform: `translate(calc(-50% + ${stackX}px), calc(-50% + ${stackY}px))`,
      };

  return (
    <div
      className={`clmPageModal ${maximized ? "clmPageModalMax" : ""}`}
      style={positionStyle}
      role="dialog"
      aria-label={ariaLabel}
      onMouseDown={onFocus}
    >
      <div className="clmModalWrap">
        <div className="clmModalHeader">
          <div className="clmHeaderPage">
            <div className="clmOpenPage">
              <ul>
                <li className={`clmActivePage clmHoverLight`}>
                  <a href="#" onClick={(e) => e.preventDefault()} aria-hidden />
                  <button type="button" className={`clmExitPage clmHoverDark`} aria-label="탭 닫기">
                    <i className="fa-solid fa-xmark" />
                  </button>
                </li>
                <li className="clmHoverLight">
                  <a href="#" onClick={(e) => e.preventDefault()} aria-hidden />
                  <button type="button" className={`clmExitPage clmHoverDark`} aria-label="탭 닫기">
                    <i className="fa-solid fa-xmark" />
                  </button>
                </li>
                <button type="button" className={`clmNewPage clmHoverDark`} aria-label="새 탭">
                  <i className="fa-solid fa-plus" />
                </button>
              </ul>
            </div>
            <div className="clmHeaderRight">
              <button type="button" className="clmHoverDark" aria-label="메뉴">
                <i className="fa-solid fa-chevron-down" />
              </button>
              <button type="button" className={`clmMinimize clmHoverDark`} aria-label="최소화">
                <i className="fa-solid fa-window-minimize" />
              </button>
              <button
                type="button"
                className="clmHoverDark"
                aria-label="최대화"
                onClick={(e) => {
                  e.stopPropagation();
                  setMaximized((m) => !m);
                }}
              >
                <i className="fa-regular fa-square" />
              </button>
              <button
                type="button"
                className="clmHoverDark"
                aria-label="닫기"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          </div>
          <div className="clmHeaderAddress">
            <div className="clmAddressMove">
              <button type="button" aria-label="뒤로">
                <i className="fa-solid fa-arrow-left" />
              </button>
              <button type="button" aria-label="앞으로">
                <i className="fa-solid fa-arrow-right" />
              </button>
              <button type="button" aria-label="새로고침">
                <i className="fa-solid fa-rotate-right" />
              </button>
            </div>
            <div className="clmAddressDetail">
              <button type="button" aria-label="보안">
                <i className="fa-solid fa-lock" />
              </button>
              <p className="clmAddressUrl">{displayAddressUrl ?? iframeUrl}</p>
              <button type="button" aria-label="북마크">
                <i className="fa-regular fa-star" />
              </button>
            </div>
            <button type="button" className={`clmSettingChrome clmHoverDark`} aria-label="설정">
              <i className="fa-solid fa-ellipsis-vertical" />
            </button>
          </div>
        </div>
        <div className="clmModalBody">
          {useActivityFallback && activityChartUrl ? (
            <div className="clmActivityFallback">
              <p className="clmActivityNote">
                GitHub은 보안 정책(X-Frame-Options) 때문에 다른 사이트의 iframe 안에 프로필·Activity 페이지를
                표시하지 않습니다. 대신 기여도 차트(외부 서비스)를 보여 주고, 전체 프로필은 새 탭에서 열 수
                있습니다.
              </p>
              <Image
                src={activityChartUrl}
                alt="GitHub contribution activity"
                width={800}
                height={128}
                className="clmActivityChart"
                unoptimized
              />
              {profileUrl ? (
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clmActivityLink"
                >
                  GitHub에서 프로필·Activity 열기
                </a>
              ) : null}
            </div>
          ) : (
            <iframe title="Chrome" src={iframeUrl} className="clmIframe" />
          )}
        </div>
      </div>
    </div>
  );
}
