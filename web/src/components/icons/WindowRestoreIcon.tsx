"use client";

/**
 * Windows «이전 크기로»: 뒤 창 rect → 앞 창 rect(흰 채움) 순으로 그려
 * 앞 창의 네 변(특히 오른쪽)이 위에 그려지게 함.
 * 뒤 창은 (δ,-δ)만 우상단으로 밀어 간격을 둠.
 * 선 두께: 24px 아이콘에서 ~1px에 가깝게 → SW ≈ VB/26(뷰박스 단위).
 */
const VB = 40;
/** 한 변을 20→18로 살짝 축소 */
const S = 14;
/** 앞·뒤 창 간격(우상단 방향 오프셋, 이전 VB/52보다 넓게) */
const δ = VB / 12;
const SW = VB / 50;
/** 뷰박스 안에서 대략 중앙 */
const FX = (VB - S) / 2;
const FY = (VB - S) / 2;

export function WindowRestoreIcon({
  frontFill = "var(--window-restore-front-fill, #ffffff)",
  className = "block h-6 w-6 shrink-0",
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
