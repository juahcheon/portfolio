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
  /** "circle": 아이콘 이미지를 정사각 영역에서 원형 클립 (border-radius 50%) */
  shape?: "circle";
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

export type About = {
  intro: string;
  philosophy: string;
  goals: string;
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
};

export type Skills = {
  frontend: string[];
  stateData: string[];
  tools: string[];
};

export type TimelineItem = {
  dateLabel: string;
  title: string;
  description: string;
};

export type ProjectLink = { label: string; url: string };

export type Project = {
  slug: string;
  name: string;
  role: string;
  team: string;
  contribution: string;
  stackSummary: string;
  env: string;
  description: string;
  links: ProjectLink[];
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
  desktop: Desktop;
  profile: Profile;
  about: About;
  experienceSummary: ExperienceSummary;
  jobs: Job[];
  skills: Skills;
  timeline: TimelineItem[];
  projects: Project[];
  github: GithubSection;
  windowsCopy: WindowsCopy;
};
