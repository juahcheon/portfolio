import { create } from "zustand";

export type OpenWindow = {
  id: string;
  title: string;
  /** 작업 표시줄에 데스크톱과 동일한 아이콘을 표시할 때 사용 */
  taskbarIconUrl?: string;
  projectSlug?: string;
  minimized?: boolean;
  kind:
    | "thisPc"
    | "about"
    | "skills"
    | "github"
    | "projects"
    | "recycle"
    | "cmd";
  iframeUrl?: string;
};

type State = {
  open: OpenWindow[];
  activeId: string | null;
  openWindow: (w: OpenWindow) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  minimizeAll: () => void;
  focusWindow: (id: string) => void;
};

export const useDesktopStore = create<State>((set) => ({
  open: [],
  activeId: null,
  minimizeAll: () => set((s) => ({ open: s.open.map((w) => ({ ...w, minimized: true })), activeId: null })),
  openWindow: (w) =>
    set((s) => {
      if (s.open.some((x) => x.id === w.id)) {
        return {
          open: s.open.map((x) => x.id === w.id ? {
            ...x,
            ...(w.kind === "projects" && w.projectSlug ? { projectSlug: w.projectSlug } : {}),
            minimized: false,
          } : x),
          activeId: w.id,
        };
      }
      return { open: [...s.open, w], activeId: w.id };
    }),
  closeWindow: (id) =>
    set((s) => {
      const next = s.open.filter((x) => x.id !== id);
      const active =
        s.activeId === id ? ([...next].reverse().find((w) => !w.minimized)?.id ?? null) : s.activeId;
      return { open: next, activeId: active };
    }),
  minimizeWindow: (id) =>
    set((s) => ({
      open: s.open.map((w) => w.id === id ? { ...w, minimized: true } : w),
      activeId: s.activeId === id
        ? ([...s.open].reverse().find((w) => w.id !== id && !w.minimized)?.id ?? null)
        : s.activeId,
    })),
  focusWindow: (id) =>
    set((s) => s.open.some((w) => w.id === id) ? {
      open: s.open.map((w) => w.id === id && w.minimized ? { ...w, minimized: false } : w),
      activeId: id,
    } : s),
}));
