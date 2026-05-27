"use client";

import { useEffect, useRef, useState } from "react";
import type { Job, Profile } from "@/types/portfolio";

const PROMPT = "C:\\Users\\주아>";

type Line = { text: string };

function helpLines(): Line[] {
  return [
    { text: "" },
    { text: "사용 가능한 명령어:" },
    { text: "" },
    { text: "  whoami        — 개발자 소개" },
    { text: "  work-history  — 경력 사항" },
    { text: "  skills        — 기술 스택" },
    { text: "  clear         — 화면 지우기" },
    { text: "" },
  ];
}

function whoamiLines(profile: Profile): Line[] {
  return [
    { text: "" },
    { text: `  이름     ${profile.name}` },
    { text: `  직무     ${profile.title}` },
    { text: `  이메일   ${profile.email}` },
    { text: `  GitHub   ${profile.githubUrl}` },
    { text: "" },
  ];
}

function workHistoryLines(jobs: Job[]): Line[] {
  const lines: Line[] = [{ text: "" }];
  for (const job of jobs) {
    lines.push({ text: `  ● ${job.company}` });
    lines.push({ text: `    ${job.role}  │  ${job.periodLabel}  (${job.durationLabel})` });
    lines.push({ text: "" });
    lines.push({ text: "    주요 업무" });
    for (const h of job.highlights) {
      lines.push({ text: `      · ${h}` });
    }
    lines.push({ text: "" });
  }
  return lines;
}

function skillsLines(jobs: Job[]): Line[] {
  const lines: Line[] = [{ text: "" }];
  for (const job of jobs) {
    const { framework, languages, state, deploy, server, collab } = job.stack;
    lines.push({ text: `  ● ${job.company}` });
    lines.push({ text: `    Framework  ${framework}` });
    lines.push({ text: `    Languages  ${languages.join(", ")}` });
    if (state.length) lines.push({ text: `    State      ${state.join(", ")}` });
    if (deploy.length) lines.push({ text: `    Deploy     ${deploy.join(", ")}` });
    if (server.length) lines.push({ text: `    Server     ${server.join(", ")}` });
    if (collab.length) lines.push({ text: `    Collab     ${collab.join(", ")}` });
    lines.push({ text: "" });
  }
  return lines;
}

function unknownLines(cmd: string): Line[] {
  return [
    { text: "" },
    { text: `'${cmd}'은(는) 내부 또는 외부 명령이 아닙니다.` },
    { text: "" },
  ];
}

type Props = { jobs: Job[]; profile: Profile };

export function CmdTerminal({ jobs, profile }: Props) {
  const [lines, setLines] = useState<Line[]>(() => [
    { text: "Microsoft Windows [Version 10.0.19045.5965]" },
    { text: "(c) Microsoft Corporation. All rights reserved." },
    { text: "" },
    { text: `${PROMPT}help` },
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
    let newLines: Line[] = [{ text: `${PROMPT}${raw}` }];

    switch (cmd) {
      case "help":
        newLines = newLines.concat(helpLines());
        break;
      case "whoami":
        newLines = newLines.concat(whoamiLines(profile));
        break;
      case "work-history":
        newLines = newLines.concat(workHistoryLines(jobs));
        break;
      case "skills":
        newLines = newLines.concat(skillsLines(jobs));
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

  return (
    <div
      className="min-h-0 flex-1 overflow-auto bg-[#0c0c0c] p-3 font-mono text-sm text-[#cccccc] cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap leading-[1.4]">
          {line.text || " "}
        </div>
      ))}
      <div className="flex leading-[1.4]">
        <span className="whitespace-pre select-none">{PROMPT}</span>
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
