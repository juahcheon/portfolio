"use client";

import { useEffect, useRef, useState } from "react";
import { FiArrowUp, FiChevronLeft, FiChevronRight, FiHome, FiMoreHorizontal, FiSearch, FiSliders, FiX } from "react-icons/fi";
import type { Project } from "@/types/portfolio";
import { useDesktopStore } from "@/store/desktopStore";
import styles from "./MobileChrome.module.scss";

export type MobileProjectTabs = {
  projects: Project[];
  selectedSlug?: string;
  onSelect: (slug: string) => void;
};

export function MobileChromeNavigation({ tabs, address, onTop, onClose }: {
  tabs: MobileProjectTabs;
  address: string;
  onTop: () => void;
  onClose: () => void;
}) {
  const [panel, setPanel] = useState<"tabs" | "menu" | null>(null);
  const [query, setQuery] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const minimizeAll = useDesktopStore((s) => s.minimizeAll);
  useEffect(() => {
    if (panel) dialog.current?.showModal();
    else dialog.current?.close();
  }, [panel]);
  const selected = tabs.selectedSlug ?? tabs.projects[0]?.slug;
  const filtered = tabs.projects.filter((project) => `${project.name} ${project.stackSummary}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const openTabs = () => { setQuery(""); setPanel("tabs"); };
  const runAction = (action: () => void) => { setPanel(null); action(); };

  return <>
    <header className={styles.addressBar} aria-label="Chrome 주소창">
      <div className={styles.address}>
        <FiSliders aria-hidden />
        <button type="button" aria-label="주소창에서 프로젝트 찾기" onClick={openTabs}>{address.replace(/^https?:\/\//, "")}</button>
        <img src="/icons/desktop/chromeIcon.svg" alt="Chrome" />
      </div>
    </header>
    <nav className={styles.toolbar} aria-label="Chrome 도구 모음">
      <button type="button" aria-label="홈으로 돌아가기" onClick={minimizeAll}><FiChevronLeft aria-hidden /></button>
      <button type="button" aria-label="앞으로" disabled><FiChevronRight aria-hidden /></button>
      <button type="button" aria-label="프로젝트 검색" onClick={openTabs}><FiSearch aria-hidden /></button>
      <button type="button" aria-label={`프로젝트 탭 ${tabs.projects.length}개 보기`} onClick={openTabs}><span className={styles.tabCount}>{tabs.projects.length}</span></button>
      <button type="button" aria-label="Chrome 메뉴" onClick={() => setPanel("menu")}><FiMoreHorizontal aria-hidden /></button>
    </nav>
    <dialog ref={dialog} className={panel === "menu" ? styles.menu : styles.tabs} aria-label={panel === "menu" ? "Chrome 메뉴" : "프로젝트 탭"} onCancel={(event) => { event.preventDefault(); setPanel(null); }} onClick={(event) => { if (event.target === event.currentTarget) setPanel(null); }}>
      {panel === "tabs" ? <>
        <header><h2>{tabs.projects.length}개 탭</h2><button type="button" onClick={() => setPanel(null)}>완료</button></header>
        <label className={styles.search}><FiSearch aria-hidden /><input type="search" aria-label="프로젝트 탭 검색" placeholder="프로젝트 및 기술 검색" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <div className={styles.tabGrid}>
          {filtered.map((project) => <button type="button" key={project.slug} aria-label={`${project.name} 탭 열기`} aria-current={project.slug === selected ? "page" : undefined} onClick={() => runAction(() => tabs.onSelect(project.slug))}>
            <span className={styles.tabTitle}><img src="/icons/desktop/chromeIcon.svg" alt="" />{project.name}</span>
            <span className={styles.tabPreview}>{project.screenshots?.[0] ? <img src={project.screenshots[0].imageUrl} alt="" /> : <strong>{project.name}</strong>}<span>{project.aboutSummary ?? project.description}</span></span>
          </button>)}
        </div>
        {filtered.length === 0 && <p className={styles.empty} role="status">검색 결과가 없습니다.</p>}
      </> : <>
        <header><h2>Chrome</h2><button type="button" aria-label="메뉴 닫기" onClick={() => setPanel(null)}><FiX aria-hidden /></button></header>
        <button type="button" onClick={() => runAction(onTop)}><FiArrowUp aria-hidden />페이지 맨 위로</button>
        <button type="button" onClick={() => runAction(minimizeAll)}><FiHome aria-hidden />홈 화면으로</button>
        <button type="button" onClick={() => runAction(onClose)}><FiX aria-hidden />프로젝트 창 닫기</button>
      </>}
    </dialog>
  </>;
}
