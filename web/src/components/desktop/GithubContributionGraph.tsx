"use client";

import { useId, useRef, useState } from "react";
import type { GithubContributionDay } from "@/lib/githubContributions";

export const contributionColors = ["#eeeeee", "#c6e48b", "#7bc96f", "#239a3b", "#196127"];
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dateFormat = new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

export function GithubContributionGraph({ days }: { days: GithubContributionDay[] }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const cellsRef = useRef<(SVGRectElement | null)[]>([]);
  const tooltipId = useId();
  const [activeIndex, setActiveIndex] = useState(days.length - 1);
  const [tooltip, setTooltip] = useState<{ index: number; left: number; top: number } | null>(null);
  const offset = new Date(days[0].date).getUTCDay();
  const columns = Math.ceil((offset + days.length) / 7);
  const describe = (day: GithubContributionDay) => `${dateFormat.format(new Date(day.date))}, 기여 ${day.count.toLocaleString("ko-KR")}회`;

  function showTooltip(index: number, cell: SVGRectElement) {
    const host = hostRef.current?.getBoundingClientRect();
    if (!host) return;
    const bounds = cell.getBoundingClientRect();
    setActiveIndex(index);
    setTooltip({ index, left: Math.max(110, Math.min(host.width - 110, bounds.left - host.left + bounds.width / 2)), top: bounds.top - host.top - 8 });
  }

  return (
    <div ref={hostRef} className="relative pt-9">
      <div className="overflow-x-auto" onScroll={() => setTooltip(null)}>
        <svg viewBox={`0 0 ${28 + columns * 12} 104`} className="block h-auto min-w-[1100px] w-full roomy:min-w-[580px]" role="group" aria-label="날짜별 GitHub 기여 활동. 날짜를 누르거나 방향키로 이동할 수 있습니다." onPointerLeave={(event) => { if (event.pointerType === "mouse") setTooltip(null); }}>
          {days.map((day, index) => {
            const date = new Date(day.date);
            const week = Math.floor((offset + index) / 7);
            return date.getUTCDate() === 1 ? <text key={`month-${day.date}`} x={28 + week * 12} y={10} fill="#59636e" fontSize={9}>{monthNames[date.getUTCMonth()]}</text> : null;
          })}
          {["Mon", "Wed", "Fri"].map((label, index) => <text key={label} x={0} y={39 + index * 24} fill="#59636e" fontSize={9}>{label}</text>)}
          {days.map((day, index) => (
            <rect
              key={day.date}
              ref={(cell) => { cellsRef.current[index] = cell; }}
              data-date={day.date}
              x={28 + Math.floor((offset + index) / 7) * 12}
              y={20 + ((offset + index) % 7) * 12}
              width={10} height={10} rx={2}
              fill={contributionColors[day.level]}
              role="button"
              tabIndex={index === activeIndex ? 0 : -1}
              aria-label={describe(day)}
              aria-describedby={tooltip?.index === index ? tooltipId : undefined}
              className="cursor-default stroke-transparent hover:stroke-[#59636e] focus:stroke-[#0969da] focus:outline-none"
              onPointerEnter={(event) => { if (event.pointerType === "mouse") showTooltip(index, event.currentTarget); }}
              onPointerLeave={(event) => { if (event.pointerType === "mouse") setTooltip(null); }}
              onFocus={(event) => showTooltip(index, event.currentTarget)}
              onBlur={() => setTooltip(null)}
              onClick={(event) => showTooltip(index, event.currentTarget)}
              onKeyDown={(event) => {
                if (event.key === "Escape") { setTooltip(null); return; }
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  showTooltip(index, event.currentTarget);
                  return;
                }
                const step = { ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 }[event.key];
                const next = event.key === "Home" ? 0 : event.key === "End" ? days.length - 1 : step !== undefined ? Math.max(0, Math.min(days.length - 1, index + step)) : undefined;
                if (next !== undefined) {
                  event.preventDefault();
                  cellsRef.current[next]?.focus();
                }
              }}
            />
          ))}
        </svg>
      </div>
      {tooltip ? (
        <div id={tooltipId} role="tooltip" className="pointer-events-none absolute z-10 w-[220px] -translate-x-1/2 -translate-y-full rounded-md bg-[#25292e] px-2 py-2 text-center text-[13px] roomy:text-xs text-white shadow-md" style={{ left: tooltip.left, top: tooltip.top }}>
          {describe(days[tooltip.index])}
        </div>
      ) : null}
    </div>
  );
}
