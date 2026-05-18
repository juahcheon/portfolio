"use client";

import {
  FaArrowLeft,
  FaArrowRight,
  FaArrowRotateRight,
  FaArrowUp,
  FaFileCode,
  FaFileZipper,
  FaList,
  FaMagnifyingGlass,
  FaMarkdown,
  FaRegFileLines,
  FaRegSquare,
  FaTrashCan,
  FaWindowMaximize,
} from "react-icons/fa6";
import { ExplorerFolderIcon } from "./ExplorerFolderIcon";
import { ExplorerSidebar } from "./ExplorerSidebar";
import {
  exAddressBox,
  exAddressCrumb,
  exAppIcon,
  exCommandBar,
  exFileIcon,
  exFolderImg,
  exJsonColor,
  exListPane,
  exMainRow,
  exMdColor,
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
  exTextColor,
  exTh,
  exThRow,
  exTr,
  exZipColor,
} from "./explorerShellClasses";

type Row = {
  name: string;
  original: string;
  deleted: string;
  size: string;
  type: string;
  icon: "folder" | "zip" | "text" | "json" | "md" | "app";
};

const rows: Row[] = [
  {
    name: ".gitignore",
    original: "C:\\Users\\주아\\Documents\\project",
    deleted: "2025-11-02 오후 3:41",
    size: "1KB",
    type: "텍스트 문서",
    icon: "text",
  },
  {
    name: "09_redux_toolkit",
    original: "D:\\factory",
    deleted: "2025-10-28 오전 11:12",
    size: "",
    type: "파일 폴더",
    icon: "folder",
  },
  {
    name: "09_redux_toolkit",
    original: "D:\\factory",
    deleted: "2025-10-28 오전 11:10",
    size: "24KB",
    type: "압축(Zipped) 폴더",
    icon: "zip",
  },
  {
    name: "fruit_shop_vite1",
    original: "D:\\factory",
    deleted: "2025-10-21 오후 8:05",
    size: "156KB",
    type: "압축(Zipped) 폴더",
    icon: "zip",
  },
  {
    name: "OP.GG Setup 2.2.1",
    original: "C:\\Users\\주아\\Downloads",
    deleted: "2025-09-14 오후 2:22",
    size: "98MB",
    type: "응용 프로그램",
    icon: "app",
  },
  {
    name: "package",
    original: "D:\\factory\\portfolio\\web",
    deleted: "2025-08-30 오전 9:18",
    size: "2KB",
    type: "JSON 원본 파일",
    icon: "json",
  },
  {
    name: "README.admin.backup",
    original: "D:\\factory\\portfolio",
    deleted: "2025-08-01 오후 4:55",
    size: "4KB",
    type: "Markdown 원본 파일",
    icon: "md",
  },
];

function FileGlyph({ kind }: { kind: Row["icon"] }) {
  switch (kind) {
    case "folder":
      return <ExplorerFolderIcon width={16} height={16} className={exFolderImg} />;
    case "zip":
      return <FaFileZipper className={`${exFileIcon} ${exZipColor}`} aria-hidden />;
    case "text":
      return <FaRegFileLines className={`${exFileIcon} ${exTextColor}`} aria-hidden />;
    case "json":
      return <FaFileCode className={`${exFileIcon} ${exJsonColor}`} aria-hidden />;
    case "md":
      return <FaMarkdown className={`${exFileIcon} ${exMdColor}`} aria-hidden />;
    case "app":
      return <FaWindowMaximize className={`${exFileIcon} ${exAppIcon}`} aria-hidden />;
    default:
      return null;
  }
}

export function RecycleBinExplorerView() {
  return (
    <div className={exShell}>
      <div className={exCommandBar}>
        <div className={exNavCluster}>
          <button type="button" className={exNavBtn} aria-label="뒤로" title="뒤로">
            <FaArrowLeft aria-hidden />
          </button>
          <button type="button" className={exNavBtn} aria-label="앞으로" title="앞으로">
            <FaArrowRight aria-hidden />
          </button>
          <button type="button" className={exNavBtn} aria-label="상위 폴더" title="상위 폴더">
            <FaArrowUp aria-hidden />
          </button>
        </div>
        <div className={exAddressBox}>
          <FaTrashCan className="text-xs text-[#6b6b6b]" aria-hidden />
          <span className={exAddressCrumb}>&gt; 휴지통</span>
        </div>
        <button type="button" className={exRefreshBtn} aria-label="새로 고침">
          <FaArrowRotateRight aria-hidden />
        </button>
        <div className={exSearchWrap}>
          <input className={exSearchInput} type="search" placeholder="휴지통 검색" readOnly aria-readonly />
          <FaMagnifyingGlass className={exSearchMag} aria-hidden />
        </div>
      </div>

      <div className={exMainRow}>
        <ExplorerSidebar />
        <div className={exListPane}>
          <div className={exTableScroll}>
            <table className={exTable}>
              <colgroup>
                <col style={{ width: "26%" }} />
                <col style={{ width: "34%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "10%" }} />
              </colgroup>
              <thead>
                <tr className={exThRow}>
                  <th className={exTh} scope="col">
                    이름
                  </th>
                  <th className={exTh} scope="col">
                    원래 위치
                  </th>
                  <th className={exTh} scope="col">
                    삭제된 날짜
                  </th>
                  <th className={exTh} scope="col">
                    크기
                  </th>
                  <th className={exTh} scope="col">
                    항목 유형
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={`${row.name}-${row.deleted}-${i}`} className={exTr}>
                    <td className={exTd}>
                      <div className={exNameCell}>
                        <FileGlyph kind={row.icon} />
                        <span>{row.name}</span>
                      </div>
                    </td>
                    <td className={exTd} title={row.original}>
                      {row.original}
                    </td>
                    <td className={exTd}>{row.deleted}</td>
                    <td className={exTd}>{row.size}</td>
                    <td className={exTd}>{row.type}</td>
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
