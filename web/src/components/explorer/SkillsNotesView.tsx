"use client";

import { useRef, useState } from "react";
import { FiArrowUp, FiChevronLeft, FiSearch, FiX } from "react-icons/fi";
import type { PortfolioPayload } from "@/types/portfolio";
import { useDesktopStore } from "@/store/desktopStore";
import styles from "./SkillsNotesView.module.scss";

export function SkillsNotesView({ skills, hidden }: { skills: PortfolioPayload["skills"]; hidden: boolean }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const scrollRef = useRef<HTMLElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);
  const minimizeAll = useDesktopStore((s) => s.minimizeAll);
  const term = query.trim().toLocaleLowerCase();
  const folders = skills.folders.map((folder) => ({ ...folder, files: folder.files.filter((file) => `${folder.name} ${file.displayName} ${file.fileName}`.toLocaleLowerCase().includes(term)) })).filter((folder) => folder.files.length > 0);
  const count = folders.reduce((total, folder) => total + folder.files.length, 0);
  const closeSearch = () => { setSearchOpen(false); setQuery(""); searchButton.current?.focus(); };

  return <div className={styles.notes} style={hidden ? { display: "none" } : undefined} aria-label="스킬 메모">
    <header className={styles.header}>
      <button type="button" onClick={minimizeAll} aria-label="홈으로 돌아가기"><FiChevronLeft aria-hidden /><span>홈</span></button>
      <span>메모</span>
      <button ref={searchButton} type="button" onClick={() => searchOpen ? closeSearch() : setSearchOpen(true)} aria-label="스킬 메모 검색" aria-expanded={searchOpen}><FiSearch aria-hidden /></button>
    </header>
    {searchOpen && <div className={styles.search}>
      <FiSearch aria-hidden /><input autoFocus type="search" aria-label="스킬 검색" placeholder="메모에서 검색" value={query} onChange={(event) => { setQuery(event.target.value); scrollRef.current?.scrollTo({ top: 0 }); }} onKeyDown={(event) => { if (event.key === "Escape") closeSearch(); }} />
      <button type="button" aria-label="스킬 검색 닫기" onClick={closeSearch}><FiX aria-hidden /></button>
    </div>}
    <main ref={scrollRef} className={styles.paper}>
      <h1>기술 스택</h1>
      <p className={styles.subtitle}>스킬</p>
      {folders.map((folder) => <section key={folder.id} aria-label={folder.name}>
        <h2>{folder.name}</h2>
        <ul>{folder.files.map((file) => <li key={file.id}>{file.displayName}</li>)}</ul>
      </section>)}
      {count === 0 && <p className={styles.empty} role="status">검색 결과가 없습니다.</p>}
    </main>
    <footer className={styles.footer}>
      <span aria-live="polite">{folders.length}개 분야 · {count}개 기술</span>
      <button type="button" aria-label="메모 맨 위로" onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })}><FiArrowUp aria-hidden /></button>
    </footer>
  </div>;
}
