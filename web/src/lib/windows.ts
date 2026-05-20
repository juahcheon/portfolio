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
      return { id, title: "내 PC", kind: "thisPc" };
    case "skills":
      return { id, title: "스킬", kind: "skills" };
    case "about":
      return { id, title: "자기소개", kind: "about" };
    case "github":
      return {
        id: "win-github",
        title: "GitHub",
        kind: "github",
      };
    case "cursor":
      return { id, title: "Cursor", kind: "cursor" };
    case "projects":
      return { id, title: "프로젝트", kind: "projects" };
    default:
      return null;
  }
}

export function githubWindow(): OpenWindow {
  return {
    id: "win-github",
    title: "GitHub",
    kind: "github",
    taskbarIconUrl: "/img/webp/github.webp",
  };
}

export function timelineWindow(): OpenWindow {
  return {
    id: "win-timeline",
    title: "타임라인",
    kind: "timeline",
    taskbarIconUrl: "/img/document.png",
  };
}
