"use client";

/** Windows 복원 버튼: 10px 영역, 1px 선, 두 창 사이 2px 간격. */
const VB = 10;
const S = 7;
const δ = 2;
const SW = 1;
const FX = 0.5;
const FY = 2.5;

export function WindowRestoreIcon({
  frontFill = "var(--window-restore-front-fill, #ffffff)",
  className = "block h-2.5 w-2.5 shrink-0",
}: {
  frontFill?: string;
  className?: string;
}) {
  const bx = FX + δ;
  const by = FY - δ;
  return (
    <svg
      className={`pointer-events-none ${className}`}
      viewBox={`0 0 ${VB} ${VB}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* 뒤 창 — 먼저 그림 */}
      <rect
        x={bx}
        y={by}
        width={S}
        height={S}
        stroke="currentColor"
        strokeWidth={SW}
        fill="none"
      />
      {/* 앞 창 — 나중에 그려 테두리(오른쪽 포함)가 가려지지 않음 */}
      <rect
        x={FX}
        y={FY}
        width={S}
        height={S}
        stroke="currentColor"
        strokeWidth={SW}
        fill={frontFill}
      />
    </svg>
  );
}
