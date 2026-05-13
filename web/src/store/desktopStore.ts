import { create } from "zustand";

export type OpenWindow = {
  id: string;
  title: string;
  kind:
    | "thisPc"
    | "about"
    | "experience"
    | "skills"
    | "timeline"
    | "projects"
    | "github"
    | "chrome"
    | "recycle";
  iframeUrl?: string;
  /** github.com 은 iframe 불가 → 기여도 이미지로 대체할 때 사용 */
  githubActivityChartUrl?: string;
  githubProfileUrl?: string;
};

type State = {
  open: OpenWindow[];
  activeId: string | null;
  openWindow: (w: OpenWindow) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
};

export const useDesktopStore = create<State>((set) => ({
  open: [],
  activeId: null,
  openWindow: (w) =>
    set((s) => {
      if (s.open.some((x) => x.id === w.id)) {
        return { activeId: w.id };
      }
      return { open: [...s.open, w], activeId: w.id };
    }),
  closeWindow: (id) =>
    set((s) => {
      const next = s.open.filter((x) => x.id !== id);
      const active =
        s.activeId === id ? (next[next.length - 1]?.id ?? null) : s.activeId;
      return { open: next, activeId: active };
    }),
  focusWindow: (id) => set({ activeId: id }),
}));
