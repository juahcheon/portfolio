"use client";

import { useEffect, useRef, useState } from "react";
import type { PortfolioPayload, Profile, Project } from "@/types/portfolio";
import packageInfo from "../../../package.json";

type Line = { text: string; color?: "green" | "yellow" | "cyan" | "dim" | "white" };

function helpLines(): Line[] {
  return [
    { text: "" },
    { text: "  npm run dev       개발 서버 실행 방법" },
    { text: "  git log           프로젝트별 소개와 기여" },
    { text: "  git status        근무 경험과 프로젝트 상태" },
    { text: "  cat skills.md     기술 스택 출력" },
    { text: "  troubleshoot      프로젝트별 트러블슈팅" },
    { text: "                    예: troubleshoot ai-switch-docs", color: "dim" },
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
    { text: `  ${profile.githubUrl}`, color: "dim" },
    { text: "" },
    ...(profile.aiToolAttitude ? [
      { text: `  ${profile.aiToolAttitude.heading}`, color: "cyan" as const },
      { text: `  ${profile.aiToolAttitude.body}` },
      { text: "" },
    ] : []),
  ];
}

function npmRunDevLines(siteUrl?: string): Line[] {
  return [
    { text: "" },
    { text: `  > ${packageInfo.name}@${packageInfo.version} dev` },
    { text: `  > ${packageInfo.scripts.dev}` },
    { text: "" },
    { text: "  web 폴더에서 실행하는 개발 명령입니다." },
    { text: "  이 체험 화면에서는 실제 서버를 실행하지 않습니다.", color: "dim" },
    ...(siteUrl ? [{ text: `  배포 주소: ${siteUrl}`, color: "cyan" as const }] : []),
    { text: "" },
  ];
}

function gitLogLines(projects: Project[]): Line[] {
  return [
    { text: "" },
    { text: "  프로젝트별 소개와 기여", color: "cyan" },
    { text: "" },
    ...projects.flatMap((project): Line[] => [
      { text: `  ${project.name}`, color: "yellow" },
      { text: `  ${project.aboutSummary ?? project.description}` },
      { text: `  담당: ${project.contribution || project.role}`, color: "white" },
      { text: `  문제 해결: troubleshoot ${project.slug}`, color: "dim" },
      { text: "" },
    ]),
  ];
}

function gitStatusLines({ profile, jobs, projects }: PortfolioPayload): Line[] {
  return [
    { text: "" },
    { text: `  ${profile.name} | ${profile.title}`, color: "green" },
    { text: "" },
    { text: "  근무 경험", color: "cyan" },
    ...jobs.flatMap((job): Line[] => [
      { text: `  ${job.company} | ${job.periodLabel}`, color: "white" },
      { text: `  ${[job.serviceName, job.role].filter(Boolean).join(" / ")}` },
      ...(job.stackSummary ? [{ text: `  ${job.stackSummary}` }] : []),
      { text: "" },
    ]),
    { text: `  등록된 프로젝트: ${projects.length}개`, color: "cyan" },
    ...projects.filter((project) => project.statusLabel).map((project): Line => (
      { text: `  ${project.name}: ${project.statusLabel}`, color: "yellow" }
    )),
    { text: "" },
  ];
}

function catSkillsLines({ skills, projects }: PortfolioPayload): Line[] {
  return [
    { text: "" },
    { text: "  # skills.md", color: "cyan" },
    { text: "" },
    ...skills.folders.flatMap((folder): Line[] => [
      { text: `  ${folder.name}`, color: "white" },
      { text: `  ${folder.files.map((file) => file.displayName).join(", ")}` },
      { text: "" },
    ]),
    { text: "  프로젝트별 기술과 도구", color: "cyan" },
    ...projects.flatMap((project): Line[] => [
      { text: `  ${project.name}`, color: "white" },
      { text: `  ${project.stackSummary}` },
      { text: `  ${project.env}` },
      { text: "" },
    ]),
  ];
}

function lsLines(projects: Project[]): Line[] {
  return [
    { text: "" },
    ...projects.map((project): Line => ({
      text: `  ${project.name}/${project.statusLabel ? `  (${project.statusLabel})` : ""}`,
      color: "cyan",
    })),
    { text: "  자기소개.docx", color: "white" },
    { text: "" },
  ];
}

function troubleshootingLines(projects: Project[], query = ""): Line[] {
  const selected = query
    ? projects.filter((project) => project.slug.toLowerCase() === query || project.name.toLowerCase() === query)
    : projects;
  if (!selected.length) return [
    { text: `  프로젝트를 찾을 수 없습니다: ${query}`, color: "yellow" },
    { text: `  사용 가능한 이름: ${projects.map((project) => project.slug).join(", ")}` },
    { text: "" },
  ];
  return [
    { text: "" },
    ...selected.flatMap((project): Line[] => [
      { text: `  ${project.name} — 트러블슈팅`, color: "cyan" },
      ...(project.troubleshooting?.length ? project.troubleshooting.flatMap((item, index): Line[] => [
        { text: `  사례 ${index + 1}`, color: "yellow" },
        ...(typeof item === "string" ? [{ text: `  ${item}` }] : [
          { text: `  발단: ${item.발단}` },
          { text: `  전개: ${item.전개}` },
          { text: `  해결: ${item.해결}`, color: "white" as const },
        ]),
        { text: "" },
      ]) : [{ text: "  등록된 트러블슈팅이 없습니다." }, { text: "" }]),
    ]),
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

type Props = { data: PortfolioPayload; mobile?: boolean };

export function CmdTerminal({ data, mobile = false }: Props) {
  const { profile, projects } = data;
  const prompt = `${profile.githubUsername}@portfolio:~$`;
  const [lines, setLines] = useState<Line[]>(() => [
    { text: `${profile.name} | ${profile.title} | 포트폴리오 터미널`, color: "cyan" },
    { text: "명령어로 소개, 근무 경험과 프로젝트를 살펴보세요.", color: "dim" },
    { text: "" },
    { text: `${prompt} help` },
    ...helpLines(),
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!mobile) return;
    let frame = 0;
    const revealInput = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (document.activeElement === inputRef.current) inputRef.current?.scrollIntoView({ block: "nearest" });
      });
    };
    window.visualViewport?.addEventListener("resize", revealInput);
    return () => { cancelAnimationFrame(frame); window.visualViewport?.removeEventListener("resize", revealInput); };
  }, [mobile]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: mobile ? "instant" : "smooth", block: "nearest" });
  }, [lines, mobile]);

  function runCommand(raw: string) {
    const cmd = raw.trim().toLowerCase();
    let newLines: Line[] = [{ text: `${prompt} ${raw}` }];

    switch (cmd) {
      case "help":
        newLines = newLines.concat(helpLines());
        break;
      case "whoami":
        newLines = newLines.concat(whoamiLines(profile));
        break;
      case "npm run dev":
        newLines = newLines.concat(npmRunDevLines(data.siteUrl));
        break;
      case "git log":
        newLines = newLines.concat(gitLogLines(projects));
        break;
      case "git status":
        newLines = newLines.concat(gitStatusLines(data));
        break;
      case "cat skills.md":
        newLines = newLines.concat(catSkillsLines(data));
        break;
      case "troubleshoot":
        newLines = newLines.concat(troubleshootingLines(projects));
        break;
      case "ls":
        newLines = newLines.concat(lsLines(projects));
        break;
      case "clear":
        setLines([]);
        setInput("");
        setHistIdx(-1);
        return;
      case "":
        newLines = [{ text: prompt }];
        break;
      default:
        newLines = newLines.concat(cmd.startsWith("troubleshoot ")
          ? troubleshootingLines(projects, cmd.slice("troubleshoot ".length).trim())
          : unknownLines(cmd));
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
      className="min-h-0 flex-1 overflow-auto [overflow-wrap:anywhere] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-[#0c0c0c] p-4 font-mono text-base roomy:text-sm cursor-text"
      onClick={mobile ? undefined : () => { if (window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus(); }}
    >
      {lines.map((line, i) => (
        <div key={i} className={`whitespace-pre-wrap leading-[1.5] ${colorClass(line.color)}`}>
          {line.text || " "}
        </div>
      ))}
      <div className="flex flex-col roomy:flex-row leading-[1.5] text-[#cccccc]">
        <span className="whitespace-pre select-none text-[#4ec94e]">{prompt}&nbsp;</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-11 min-w-0 flex-1 bg-transparent text-[#cccccc] font-mono text-base roomy:min-h-0 roomy:text-sm outline-none caret-[#cccccc]"
          aria-label="명령 입력"
          autoFocus={!mobile && typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches}
          onFocus={() => inputRef.current?.scrollIntoView({ block: "nearest" })}
          enterKeyHint="send"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
