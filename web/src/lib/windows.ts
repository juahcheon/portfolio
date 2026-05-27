import type { PortfolioPayload } from "@/types/portfolio";
import type { OpenWindow } from "@/store/desktopStore";

export function openWindowFromDesktopId(
  windowId: string,
  data: PortfolioPayload
): OpenWindow | null {
  const id = `win-${windowId}`;
  switch (windowId) {
    case "trash":
      return { id, title: "\ud734\uc9c0\ud1b5", kind: "recycle" };
    case "hero":
      return { id, title: "\ub0b4 PC", kind: "thisPc" };
    case "skills":
      return { id, title: "\uc2a4\ud0ac", kind: "skills" };
    case "about":
      return { id, title: "\uc790\uae30\uc18c\uac1c", kind: "about" };
    case "github":
      return {
        id: "win-github",
        title: "GitHub",
        kind: "github",
      };
    case "cmd":
      return { id, title: "명령 프롬프트", kind: "cmd" };
    case "projects":
      return { id, title: "\ud504\ub85c\uc81d\ud2b8", kind: "projects" };
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
    title: "\ud0c0\uc784\ub77c\uc778",
    kind: "timeline",
    taskbarIconUrl: "/img/document.png",
  };
}
