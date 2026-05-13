import type { PortfolioPayload } from "@/types/portfolio";
import type { OpenWindow } from "@/store/desktopStore";

export function openWindowFromDesktopId(
  windowId: string,
  data: PortfolioPayload
): OpenWindow | null {
  const id = `win-${windowId}`;
  switch (windowId) {
    case "trash":
      return { id, title: "휴지통", kind: "recycle" };
    case "hero":
      return { id, title: "내 PC", kind: "profile" };
    case "skills":
      return { id, title: "제어판", kind: "skills" };
    case "about":
      return { id, title: "Word", kind: "about" };
    case "experience":
      return { id, title: "Excel", kind: "experience" };
    case "projects":
      return { id, title: "PowerPoint", kind: "projects" };
    case "chrome":
      return {
        id,
        title: "Chrome",
        kind: "chrome",
        iframeUrl: data.windowsCopy.chromeFrameUrl,
      };
    default:
      return null;
  }
}

export function githubWindow(): OpenWindow {
  return {
    id: "win-github",
    title: "GitHub",
    kind: "github",
  };
}

export function timelineWindow(): OpenWindow {
  return { id: "win-timeline", title: "타임라인", kind: "timeline" };
}
