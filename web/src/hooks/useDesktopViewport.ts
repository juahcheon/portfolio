"use client";

import { useEffect, useState } from "react";
import { DESKTOP_VIEWPORT, ROOMY_VIEWPORT } from "@/lib/desktopViewport";

/** One breakpoint for window behavior; visual viewport also follows the software keyboard. */
export function useDesktopViewport() {
  const [viewport, setViewport] = useState<{ mobile: boolean; compact: boolean; height: number } | null>(null);
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_VIEWPORT);
    const roomy = window.matchMedia(ROOMY_VIEWPORT);
    const update = () => {
      const visual = window.visualViewport;
      // Pinch zoom must not resize the app underneath the user.
      const zoomed = visual && Math.abs(visual.scale - 1) > 0.05;
      setViewport((previous) => ({
        mobile: !query.matches,
        compact: !roomy.matches,
        height: zoomed ? previous?.height ?? window.innerHeight : visual?.height ?? window.innerHeight,
      }));
    };
    update();
    query.addEventListener("change", update);
    roomy.addEventListener("change", update);
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    return () => {
      query.removeEventListener("change", update);
      roomy.removeEventListener("change", update);
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, []);
  return viewport;
}
