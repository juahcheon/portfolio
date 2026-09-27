"use client";

import type { PortfolioPayload } from "@/types/portfolio";
import { useDesktopStore } from "@/store/desktopStore";
import { openWindowFromDesktopId } from "@/lib/windows";
import styles from "./MobilePortfolio.module.scss";

export function MobileTaskbar({ data }: { data: PortfolioPayload }) {
  const activeId = useDesktopStore((s) => s.activeId);
  const openWindow = useDesktopStore((s) => s.openWindow);
  const minimizeAll = useDesktopStore((s) => s.minimizeAll);
  if (activeId !== null) return <button type="button" className={styles.homeIndicator} aria-label="홈 화면으로 돌아가기" onClick={minimizeAll}><span /></button>;
  return (
    <nav aria-label="고정 앱 독" className={styles.dock}>
      {["about", "projects", "github", "cmd"].map((id) => {
        const icon = data.desktop.icons.find((item) => item.windowId === id);
        if (!icon) return null;
        return <button key={id} type="button" aria-label={id === "cmd" ? "CMD" : icon.label} onClick={() => {
          const win = openWindowFromDesktopId(id, data);
          if (win) openWindow({ ...win, taskbarIconUrl: icon.imageUrl });
        }}><span className={styles.appIcon}><img src={icon.imageUrl} alt="" draggable={false} /></span></button>;
      })}
    </nav>
  );
}
