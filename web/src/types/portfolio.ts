export type DesktopIcon = {
  column: number;
  id: string;
  label: string;
  imageUrl: string;
  action: "window" | "external";
  windowId?: string;
  url?: string;
  /** 다음 아이콘과 세로 간격 제거 */
  gapAfter?: "none";
  /** "circle": 원형 클립 · "rounded10": 10px 모서리 (Cursor 창과 맞춤) */
  shape?: "circle" | "rounded10";
};

export type Desktop = {
  wallpaper: string;
  icons: DesktopIcon[];
};

export type Profile = {
  name: string;
  title: string;
  headlineLines: string[];
  email: string;
  githubUrl: string;
  githubUsername: string;
  heroPlaceholder: {
    gradientFrom: string;
    gradientTo: string;
    initial: string;
  };
};

export type ExperienceSummary = {
  totalMonths: number;
  headline: string;
};

export type JobStack = {
  framework: string;
  languages: string[];
  state: string[];
  runtime: string[];
  deploy: string[];
  server: string[];
  collab: string[];
};

export type Job = {
  company: string;
  role: string;
  focus: string;
  periodLabel: string;
  durationLabel: string;
  summary: string;
  stack: JobStack;
  highlights: string[];
  serviceName?: string;
  stackSummary?: string;
  aboutHighlights?: string[];
};

export type SkillFile = {
  id: string;
  fileName: string;
  displayName: string;
  modified: string;
  size: string;
};

export type SkillFolder = {
  id: string;
  name: string;
  modified: string;
  size: string;
  files: SkillFile[];
};

export type Skills = {
  folders: SkillFolder[];
};

export type TimelineItem = {
  dateLabel: string;
  title: string;
  description: string;
};

export type ProjectLink = { label: string; url: string };
export type ProjectDetail = { label: string; value: string };

export type StructuredTroubleshootingItem = {
  발단: string;
  전개: string;
  해결: string;
};

export type TroubleshootingItem = string | StructuredTroubleshootingItem;

export type Project = {
  slug: string;
  name: string;
  role: string;
  team: string;
  contribution: string;
  stackSummary: string;
  env: string;
  description: string;
  details?: ProjectDetail[];
  features?: string[];
  troubleshooting?: TroubleshootingItem[];
  links: ProjectLink[];
  subtitle?: string;
  aboutBadge?: string;
  aboutHighlights?: string[];
};

export type GithubSection = {
  username: string;
  profileUrl: string;
  chartImageUrl: string;
};

export type WindowsCopy = {
  trash: string;
  chromeFrameUrl: string;
};

export type PortfolioPayload = {
  version: number;
  /** 배포·공유용 프로덕션 URL (UI에서 안 쓸 수 있음) */
  siteUrl?: string;
  desktop: Desktop;
  profile: Profile;
  experienceSummary: ExperienceSummary;
  jobs: Job[];
  skills: Skills;
  timeline: TimelineItem[];
  projects: Project[];
  github: GithubSection;
  windowsCopy: WindowsCopy;
};
