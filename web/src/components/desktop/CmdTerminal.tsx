"use client";

import { useEffect, useRef, useState } from "react";
import type { Profile } from "@/types/portfolio";

const PROMPT = "juahcheon@portfolio:~$";

type Line = { text: string; color?: "green" | "yellow" | "cyan" | "dim" | "white" };

function helpLines(): Line[] {
  return [
    { text: "" },
    { text: "  npm run dev       포트폴리오 개발 서버 실행" },
    { text: "  git log           프로젝트 히스토리" },
    { text: "  git status        현재 상태" },
    { text: "  cat skills.md     기술 스택 출력" },
    { text: "  ls                프로젝트 목록" },
    { text: "  whoami            개발자 소개" },
    { text: "  clear             화면 지우기" },
    { text: "" },
  ];
}

function whoamiLines(profile: Profile): Line[] {
  return [
    { text: "" },
    { text: `  ${profile.name}`, color: "white" },
    { text: `  ${profile.title}`, color: "cyan" },
    { text: `  ${profile.email}`, color: "dim" },
    { text: `  github.com/juahcheon`, color: "dim" },
    { text: "" },
  ];
}

function npmRunDevLines(): Line[] {
  return [
    { text: "" },
    { text: "  > portfolio@0.1.0 dev" },
    { text: "  > next dev" },
    { text: "" },
    { text: "    ▲ Next.js 15.3.3", color: "white" },
    { text: "    - Local:   http://localhost:3000", color: "cyan" },
    { text: "" },
    { text: "   ✓ Starting...", color: "green" },
    { text: "   ✓ Ready in 1.2s", color: "green" },
    { text: "" },
  ];
}

function gitLogLines(): Line[] {
  return [
    { text: "" },
    { text: "  commit a3f1b2c", color: "yellow" },
    { text: "  feat: 말해부엉 Gemini API 모델 분기 최적화" },
    { text: "" },
    { text: "  commit 9d4e8a1", color: "yellow" },
    { text: "  fix: TanStack Query staleTime — 응답시간 1초 이하로 개선" },
    { text: "" },
    { text: "  commit 3c7f2b9", color: "yellow" },
    { text: "  feat: DS Helper 도메인 기반 환경 자동 분기 구현" },
    { text: "" },
    { text: "  commit 1a2b3c4", color: "yellow" },
    { text: "  feat: 소셜 로그인 흐름 및 사용자 인증 화면 구현" },
    { text: "" },
    { text: "  commit 8e9f0d5", color: "yellow" },
    { text: "  chore: EC2 GitHub Actions 자동 배포 세팅" },
    { text: "" },
    { text: "  commit 2b4c6d8", color: "yellow" },
    { text: "  feat: 포트폴리오 Windows 데스크톱 메타포 구현" },
    { text: "" },
  ];
}

function gitStatusLines(): Line[] {
  return [
    { text: "" },
    { text: "  On branch main", color: "white" },
    { text: "  현재 상태: 구직 중", color: "green" },
    { text: "" },
    { text: "  Changes ready to commit:", color: "white" },
    { text: "        new file:   천주아_포트폴리오.pdf", color: "green" },
    { text: "        modified:   README.md", color: "green" },
    { text: "" },
    { text: "  Untracked files:", color: "white" },
    { text: "        입사지원서/", color: "dim" },
    { text: "" },
  ];
}

function catSkillsLines(): Line[] {
  return [
    { text: "" },
    { text: "  # skills.md", color: "cyan" },
    { text: "" },
    { text: "  Frontend    Next.js · React · TypeScript · JavaScript", color: "white" },
    { text: "             TanStack Query · Zustand · Tailwind CSS · SCSS" },
    { text: "             REST API · 소셜 로그인 · 반응형 웹앱" },
    { text: "" },
    { text: "  Deploy      Vercel · Netlify · AWS EC2 · AWS S3", color: "white" },
    { text: "             GitHub Actions · PM2 · Nginx" },
    { text: "" },
    { text: "  Collab      Git · GitHub · Figma · Notion · Slack · Monorepo", color: "white" },
    { text: "" },
  ];
}

function lsLines(): Line[] {
  return [
    { text: "" },
    { text: "  DS-Helper/    말해부엉/    Portfolio/    자기소개.docx", color: "cyan" },
    { text: "" },
  ];
}

function unknownLines(cmd: string): Line[] {
  return [
    { text: "" },
    { text: `  command not found: ${cmd}`, color: "dim" },
    { text: "  'help' 를 입력하면 사용 가능한 명령어를 확인할 수 있습니다." },
    { text: "" },
  ];
}

type Props = { profile: Profile };

export function CmdTerminal({ profile }: Props) {
  const [lines, setLines] = useState<Line[]>(() => [
    { text: "juahcheon@portfolio:~$ —— 포트폴리오 터미널", color: "dim" },
    { text: "" },
    { text: `${PROMPT} help` },
    ...helpLines(),
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  function runCommand(raw: string) {
    const cmd = raw.trim().toLowerCase();
    let newLines: Line[] = [{ text: `${PROMPT} ${raw}` }];

    switch (cmd) {
      case "help":
        newLines = newLines.concat(helpLines());
        break;
      case "whoami":
        newLines = newLines.concat(whoamiLines(profile));
        break;
      case "npm run dev":
        newLines = newLines.concat(npmRunDevLines());
        break;
      case "git log":
        newLines = newLines.concat(gitLogLines());
        break;
      case "git status":
        newLines = newLines.concat(gitStatusLines());
        break;
      case "cat skills.md":
        newLines = newLines.concat(catSkillsLines());
        break;
      case "ls":
        newLines = newLines.concat(lsLines());
        break;
      case "clear":
        setLines([]);
        setInput("");
        setHistIdx(-1);
        return;
      case "":
        newLines = [{ text: PROMPT }];
        break;
      default:
        newLines = newLines.concat(unknownLines(cmd));
    }

    setLines((prev) => [...prev, ...newLines]);
    if (cmd) setCmdHistory((prev) => [cmd, ...prev]);
    setHistIdx(-1);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      runCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(next);
      setInput(cmdHistory[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : cmdHistory[next]);
    }
  }

  function colorClass(color?: Line["color"]) {
    switch (color) {
      case "green": return "text-[#4ec94e]";
      case "yellow": return "text-[#e5c07b]";
      case "cyan": return "text-[#56b6c2]";
      case "dim": return "text-[#666]";
      case "white": return "text-[#efefef]";
      default: return "text-[#cccccc]";
    }
  }

  return (
    <div
      className="min-h-0 flex-1 overflow-auto bg-[#0c0c0c] p-4 font-mono text-sm cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((line, i) => (
        <div key={i} className={`whitespace-pre-wrap leading-[1.5] ${colorClass(line.color)}`}>
          {line.text || " "}
        </div>
      ))}
      <div className="flex leading-[1.5] text-[#cccccc]">
        <span className="whitespace-pre select-none text-[#4ec94e]">{PROMPT}&nbsp;</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-[#cccccc] font-mono text-sm outline-none caret-[#cccccc]"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
