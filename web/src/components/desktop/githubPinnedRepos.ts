import type { Project } from "@/types/portfolio";

export type GithubPinnedRepo = {
  name: string;
  description: string;
  url: string;
  language: string;
};

/** 프로젝트 중 GitHub 링크가 있는 항목을 최대 `max`개 뽑아 핀 카드용으로 사용 */
export function pickGithubPinnedRepos(projects: Project[], max = 3): GithubPinnedRepo[] {
  const pins: GithubPinnedRepo[] = [];
  for (const p of projects) {
    const link = p.links.find((l) => /github\.com/i.test(l.url));
    if (!link) continue;
    const language = p.stackSummary.split(/[·,]/)[0]?.trim() || "Code";
    const description =
      p.description.length > 100 ? `${p.description.slice(0, 97)}…` : p.description;
    pins.push({ name: p.name, description, url: link.url, language });
    if (pins.length >= max) break;
  }
  return pins;
}
