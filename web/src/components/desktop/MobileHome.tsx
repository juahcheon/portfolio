"use client";

import { useEffect, useRef, useState } from "react";
import { FiSearch, FiWifi, FiX, FiArrowUpRight } from "react-icons/fi";
import type { DesktopIcon, PortfolioPayload } from "@/types/portfolio";
import { openWindowFromDesktopId } from "@/lib/windows";
import { useDesktopStore } from "@/store/desktopStore";
import styles from "./MobilePortfolio.module.scss";
import { MobileNotesIcon } from "@/components/icons/MobileNotesIcon";

export function MobileHome({ data }: { data: PortfolioPayload }) {
  const [now, setNow] = useState<Date | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);
  const openWindow = useDesktopStore((s) => s.openWindow);
  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, 30000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (searchOpen) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [searchOpen]);
  const closeSearch = () => { setSearchOpen(false); searchButton.current?.focus(); };
  const launch = (id: string, projectSlug?: string) => {
    setSearchOpen(false);
    const win = openWindowFromDesktopId(id, data);
    const icon = data.desktop.icons.find((item) => item.windowId === id);
    if (win) openWindow({ ...win, projectSlug, taskbarIconUrl: icon?.imageUrl ?? win.taskbarIconUrl });
  };
  const priority = ["about", "projects", "skills", "github"];
  const icons = data.desktop.icons.filter((icon) => icon.windowId !== "trash" && icon.windowId !== "hero").sort((a, b) => {
    const rank = (icon: DesktopIcon) => priority.includes(icon.windowId ?? "") ? priority.indexOf(icon.windowId!) : icon.action === "external" ? 4 : 5;
    return rank(a) - rank(b);
  });
  const labelFor = (icon: DesktopIcon) => icon.windowId === "cmd" ? "CMD" : icon.label;
  const query = search.trim().toLocaleLowerCase();
  const foundIcons = icons.filter((icon) => `${labelFor(icon)} ${icon.windowId ?? ""} ${icon.windowId === "skills" ? "메모" : ""}`.toLocaleLowerCase().includes(query));
  const foundProjects = query ? data.projects.filter((project) => `${project.name} ${project.description} ${project.stackSummary}`.toLocaleLowerCase().includes(query)) : [];
  const time = now?.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit", hour12: false }) ?? "—:—";

  return (
    <main className={styles.home} aria-label="아이폰 스타일 홈 화면">
      <div className={styles.statusbar}><time suppressHydrationWarning>{time}</time><span aria-hidden><FiWifi /><svg viewBox="0 0 27 14" fill="none"><rect x=".75" y=".75" width="22.5" height="12.5" rx="3.25" stroke="currentColor" strokeOpacity=".5" /><rect x="2.5" y="2.5" width="19" height="9" rx="1.5" fill="currentColor" /><path d="M25 4.5v5a2.6 2.6 0 0 0 0-5Z" fill="currentColor" fillOpacity=".5" /></svg></span></div>
      <div className={styles.widgets}>
        <div><button type="button" className={styles.profileWidget} onClick={() => launch("about")} aria-label="자기소개 위젯 열기">
          <span>{data.profile.title}</span><strong>{data.profile.name}</strong><span className={styles.widgetBottom}>PORTFOLIO</span>
        </button><span className={styles.widgetLabel}>자기소개</span></div>
        <div><button type="button" className={styles.calendarWidget} onClick={() => launch("projects")} aria-label="프로젝트 위젯 열기">
          <span>{now?.toLocaleDateString("ko-KR", { weekday: "long" }) ?? "오늘"}</span><strong>{now?.getDate() ?? "—"}</strong><span className={styles.calendarBottom}>{data.projects.length}개의 프로젝트<small>작업과 개발 기록</small></span>
        </button><span className={styles.widgetLabel}>프로젝트</span></div>
      </div>
      <nav className={styles.appGrid} aria-label="앱 목록">
        {icons.map((icon) => {
          const content = <><span className={styles.appIcon}>{icon.windowId === "skills" ? <MobileNotesIcon /> : <img src={icon.imageUrl} alt="" draggable={false} />}</span><span className={styles.appLabel}>{labelFor(icon)}</span></>;
          return icon.action === "external" ? <a key={icon.id} className={styles.app} href={icon.url} target="_blank" rel="noopener noreferrer">{content}</a> : <button key={icon.id} type="button" className={styles.app} onClick={() => launch(icon.windowId!)}>{content}</button>;
        })}
      </nav>
      <div className={styles.searchArea}><button ref={searchButton} type="button" className={styles.searchPill} onClick={() => setSearchOpen(true)}><FiSearch aria-hidden />검색</button></div>
      <dialog ref={dialogRef} className={styles.searchDialog} aria-label="포트폴리오 검색" onCancel={(event) => { event.preventDefault(); closeSearch(); }}>
        <div className={styles.searchField}><FiSearch aria-hidden /><input autoFocus type="search" aria-label="앱과 프로젝트 검색" placeholder="앱, 프로젝트, 기술 검색" value={search} onChange={(event) => setSearch(event.target.value)} /><button type="button" aria-label="검색 닫기" onClick={closeSearch}><FiX aria-hidden /></button></div>
        <div className={styles.searchResults}>
          {foundIcons.length > 0 && <section><h2>앱</h2>{foundIcons.map((icon) => icon.action === "external" ? <a key={icon.id} href={icon.url} target="_blank" rel="noopener noreferrer" onClick={() => setSearchOpen(false)}><img src={icon.imageUrl} alt="" /><span>{labelFor(icon)}</span><FiArrowUpRight aria-hidden /></a> : <button key={icon.id} type="button" onClick={() => launch(icon.windowId!)}>{icon.windowId === "skills" ? <MobileNotesIcon className={styles.searchNotesIcon} /> : <img src={icon.imageUrl} alt="" />}<span>{labelFor(icon)}</span></button>)}</section>}
          {foundProjects.length > 0 && <section><h2>프로젝트</h2>{foundProjects.map((project) => <button key={project.slug} type="button" onClick={() => launch("projects", project.slug)}><span>{project.name}<small>{project.githubLanguage ?? project.stackSummary}</small></span></button>)}</section>}
          {!foundIcons.length && !foundProjects.length && <p role="status">검색 결과가 없습니다.</p>}
        </div>
      </dialog>
    </main>
  );
}
