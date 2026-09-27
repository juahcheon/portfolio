"use client";

import { useLayoutEffect, useRef } from "react";

/** 본문을 유지한 채 창을 해당 작업 표시줄 아이콘으로 축소하고 복원한다. */
export function useWindowMinimize(windowId: string, minimized: boolean, animate = true) {
  const windowRef = useRef<HTMLDivElement>(null);
  const previousMinimized = useRef(minimized);

  useLayoutEffect(() => {
    const element = windowRef.current;
    if (!element) return;

    const changed = previousMinimized.current !== minimized;
    previousMinimized.current = minimized;
    element.style.display = "";

    const target = document.querySelector<HTMLElement>(
      `[data-taskbar-window="${CSS.escape(windowId)}"]`
    );
    if (!animate || !changed || !target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.style.display = minimized ? "none" : "";
      return;
    }

    const from = element.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    if (!from.width || !from.height) {
      element.style.display = minimized ? "none" : "";
      return;
    }

    const scaleX = to.width / from.width;
    const scaleY = to.height / from.height;
    const transform = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    // 개별 scale 속성이 기존 중앙 정렬·드래그 translate까지 축소하는 만큼 보정한다.
    const x = to.left + to.width / 2 - from.left - from.width / 2 + (1 - scaleX) * transform.m41;
    const y = to.top + to.height / 2 - from.top - from.height / 2 + (1 - scaleY) * transform.m42;
    const expanded = { translate: "0px 0px", scale: "1 1", opacity: 1, zIndex: 90 };
    const collapsed = { translate: `${x}px ${y}px`, scale: `${scaleX} ${scaleY}`, opacity: 0.1, zIndex: 90 };
    const animation = element.animate(
      minimized ? [expanded, collapsed] : [collapsed, expanded],
      { duration: 240, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "both" }
    );
    element.inert = minimized;
    animation.onfinish = () => {
      element.style.display = minimized ? "none" : "";
      element.inert = false;
      animation.cancel();
    };

    return () => {
      animation.onfinish = null;
      animation.cancel();
      element.inert = false;
    };
  }, [windowId, minimized, animate]);

  return windowRef;
}
