"use client";

import Image from "next/image";
import { useMemo } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaArrowRotateRight,
  FaArrowUp,
  FaList,
  FaMagnifyingGlass,
  FaRegSquare,
} from "react-icons/fa6";
import type { PortfolioPayload, SkillFolder } from "@/types/portfolio";
import { ExplorerFolderIcon } from "./ExplorerFolderIcon";
import { ExplorerHtmlFileIcon } from "./ExplorerHtmlFileIcon";
import { ExplorerSidebar } from "./ExplorerSidebar";
import {
  exAddressBox,
  exAddressCrumb,
  exCommandBar,
  exFolderImg,
  exListPane,
  exMainRow,
  exNameCell,
  exNavBtn,
  exNavCluster,
  exRefreshBtn,
  exSearchInput,
  exSearchMag,
  exSearchWrap,
  exShell,
  exStatusBar,
  exStatusIconBtn,
  exStatusRight,
  exTable,
  exTableScroll,
  exTd,
  exTh,
  exThRow,
  exTr,
} from "./explorerShellClasses";

const FOLDER_ICON = "/icons/desktop/folderIcon.png";
const HTML_DOC_TYPE = "Chrome HTML Document";

type Props = {
  skills: PortfolioPayload["skills"];
};

type FolderRow = {
  kind: "folder";
  id: string;
  name: string;
  modified: string;
  size: string;
};

type FileRow = {
  kind: "file";
  id: string;
  name: string;
  modified: string;
  size: string;
};

type ListRow = FolderRow | FileRow;

function buildFlatRows(folders: SkillFolder[]): ListRow[] {
  const rows: ListRow[] = [];

  for (const folder of folders) {
    rows.push({
      kind: "folder",
      id: folder.id,
      name: folder.name,
      modified: folder.modified,
      size: folder.size,
    });
    for (const file of folder.files) {
      rows.push({
        kind: "file",
        id: `${folder.id}-${file.id}`,
        name: file.fileName,
        modified: file.modified,
        size: file.size,
      });
    }
  }

  return rows;
}

function ListGlyph({ row }: { row: ListRow }) {
  if (row.kind === "folder") {
    return <ExplorerFolderIcon width={16} height={16} className={exFolderImg} />;
  }
  return <ExplorerHtmlFileIcon width={16} height={16} />;
}

export function SkillsExplorerView({ skills }: Props) {
  const rows = useMemo(() => buildFlatRows(skills.folders), [skills.folders]);

  return (
    <div className={exShell}>
      <div className={exCommandBar}>
        <div className={exNavCluster}>
          <button type="button" className={exNavBtn} aria-label="뒤로" title="뒤로" disabled>
            <FaArrowLeft aria-hidden />
          </button>
          <button type="button" className={exNavBtn} aria-label="앞으로" title="앞으로" disabled>
            <FaArrowRight aria-hidden />
          </button>
          <button type="button" className={exNavBtn} aria-label="상위 폴더" title="상위 폴더" disabled>
            <FaArrowUp aria-hidden />
          </button>
        </div>
        <div className={exAddressBox}>
          <Image src={FOLDER_ICON} alt="" width={16} height={16} className={exFolderImg} unoptimized />
          <span className={exAddressCrumb}>&gt; 스킬</span>
        </div>
        <button type="button" className={exRefreshBtn} aria-label="새로 고침">
          <FaArrowRotateRight aria-hidden />
        </button>
        <div className={exSearchWrap}>
          <input className={exSearchInput} type="search" placeholder="스킬 검색" readOnly aria-readonly />
          <FaMagnifyingGlass className={exSearchMag} aria-hidden />
        </div>
      </div>

      <div className={exMainRow}>
        <ExplorerSidebar />
        <div className={exListPane}>
          <div className={exTableScroll}>
            <table className={exTable}>
              <colgroup>
                <col style={{ width: "34%" }} />
                <col style={{ width: "28%" }} />
                <col style={{ width: "24%" }} />
                <col style={{ width: "14%" }} />
              </colgroup>
              <thead>
                <tr className={exThRow}>
                  <th className={exTh} scope="col">
                    이름
                  </th>
                  <th className={exTh} scope="col">
                    수정한 날짜
                  </th>
                  <th className={exTh} scope="col">
                    유형
                  </th>
                  <th className={exTh} scope="col">
                    크기
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={`${row.kind}-${row.id}`} className={exTr}>
                    <td className={exTd}>
                      <div className={`${exNameCell}${row.kind === "file" ? " pl-6" : ""}`}>
                        <ListGlyph row={row} />
                        <span>{row.name}</span>
                      </div>
                    </td>
                    <td className={exTd}>{row.modified}</td>
                    <td className={exTd}>{row.kind === "folder" ? "파일 폴더" : HTML_DOC_TYPE}</td>
                    <td className={exTd}>{row.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={exStatusBar}>
            <span>{rows.length}개 항목</span>
            <div className={exStatusRight}>
              <button type="button" className={exStatusIconBtn} aria-label="자세히">
                <FaList aria-hidden />
              </button>
              <button type="button" className={exStatusIconBtn} aria-label="큰 아이콘">
                <FaRegSquare aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
