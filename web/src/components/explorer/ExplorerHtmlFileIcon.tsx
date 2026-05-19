"use client";

type Props = {
  className?: string;
  width?: number;
  height?: number;
};

const DOCUMENT_ICON = "/icons/explore/documentIcon.png";
const CHROME_ICON = "/icons/desktop/chromeIcon.svg";

/** documentIcon 위에 Chrome 아이콘을 중앙에 겹친 HTML 파일 아이콘 */
export function ExplorerHtmlFileIcon({ className = "", width = 16, height = 16 }: Props) {
  const badge = Math.round(Math.min(width, height) * 0.52);

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width, height }}
      aria-hidden
    >
      <img
        src={DOCUMENT_ICON}
        alt=""
        width={width}
        height={height}
        className="block object-contain"
        draggable={false}
        decoding="async"
      />
      <img
        src={CHROME_ICON}
        alt=""
        width={badge}
        height={badge}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
        draggable={false}
        decoding="async"
      />
    </span>
  );
}
