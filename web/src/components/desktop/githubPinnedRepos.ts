import type { Project } from "@/types/portfolio";

export type GithubPinnedRepo = {
  name: string;
  avatarUrl?: string;
  description: string;
  url: string;
  language?: string;
  visibility: "public" | "private" | "website";
};

/** 프로젝트 순서대로 표시하며 GitHub 링크가 없으면 공개 서비스 링크를 사용 */
export function pickGithubPinnedRepos(projects: Project[], max = 4): GithubPinnedRepo[] {
  const pins: GithubPinnedRepo[] = [];
  for (const p of projects) {
    const link = p.links.find((l) => /github\.com/i.test(l.url)) ?? p.links[0];
    if (!link) continue;
    const language = p.githubLanguage;
    const description =
      p.description.length > 100 ? `${p.description.slice(0, 97)}…` : p.description;
    const isGithub = new URL(link.url).hostname === "github.com";
    pins.push({ name: p.name, avatarUrl: p.organizationAvatarUrl, description, url: link.url, language,
      visibility: isGithub ? link.visibility ?? "public" : "website" });
    if (pins.length >= max) break;
  }
  return pins;
}
