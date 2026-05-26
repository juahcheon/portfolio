"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Options = {
  /** true이면 드래그 시작 무시 (최대화 등) */
  disabled: boolean;
  /** 드래그 시작 직전 (포커스 등) */
  onBegin?: () => void;
};

/**
 * 창 타이틀 바 드래그용 오프셋. document에 pointer 리스너는 드래그 중에만 붙이고,
 * 이동 중 setState는 requestAnimationFrame으로 한 프레임에 한 번만 호출한다.
 */
export function useWindowDragOffset({ disabled, onBegin }: Options) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const offsetRef = useRef(offset);
  offsetRef.current = offset;

  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  const onBeginRef = useRef(onBegin);
  onBeginRef.current = onBegin;

  const dragActiveRef = useRef(false);
  const originRef = useRef({ clientX: 0, clientY: 0, offsetX: 0, offsetY: 0 });
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef({ x: 0, y: 0 });
  const prevUserSelectRef = useRef<string | null>(null);

  const finishDragRef = useRef<() => void>(() => {});

  const flushPendingToState = useCallback(() => {
    rafRef.current = null;
    setOffset({ x: pendingRef.current.x, y: pendingRef.current.y });
  }, []);

  const onMove = useMemo(
    () => (ev: PointerEvent) => {
      if (!dragActiveRef.current) return;
      if (disabledRef.current) {
        finishDragRef.current();
        return;
      }
      const o = originRef.current;
      pendingRef.current = {
        x: o.offsetX + (ev.clientX - o.clientX),
        y: o.offsetY + (ev.clientY - o.clientY),
      };
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(flushPendingToState);
      }
    },
    [flushPendingToState]
  );

  const onUp = useMemo(
    () => () => {
      if (!dragActiveRef.current) return;
      dragActiveRef.current = false;
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
      if (prevUserSelectRef.current !== null) {
        document.body.style.userSelect = prevUserSelectRef.current;
        prevUserSelectRef.current = null;
      }
      setOffset({ x: pendingRef.current.x, y: pendingRef.current.y });
    },
    [onMove]
  );

  const finishDrag = useCallback(() => {
    onUp();
  }, [onUp]);

  finishDragRef.current = finishDrag;

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
      if (prevUserSelectRef.current !== null) {
        document.body.style.userSelect = prevUserSelectRef.current;
      }
      dragActiveRef.current = false;
    };
  }, [onMove, onUp]);

  const resetOffset = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  const onTitleBarPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabledRef.current || e.button !== 0) return;
      const el = e.target as HTMLElement | null;
      if (el?.closest("button, a, input, textarea, select, [role='button']")) return;

      e.preventDefault();
      e.stopPropagation();
      onBeginRef.current?.();

      dragActiveRef.current = true;
      const o = offsetRef.current;
      originRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        offsetX: o.x,
        offsetY: o.y,
      };
      pendingRef.current = { x: o.x, y: o.y };

      prevUserSelectRef.current = document.body.style.userSelect;
      document.body.style.userSelect = "none";

      document.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerup", onUp);
      document.addEventListener("pointercancel", onUp);
    },
    [onMove, onUp]
  );

  return {
    offsetX: offset.x,
    offsetY: offset.y,
    onTitleBarPointerDown,
    resetOffset,
  };
}
