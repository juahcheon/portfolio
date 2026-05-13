import Image from "next/image";
import type { OpenWindow } from "@/store/desktopStore";
import type { PortfolioPayload } from "@/types/portfolio";

type Props = {
  win: OpenWindow;
  data: PortfolioPayload;
};

export function WindowContents({ win, data }: Props) {
  const { profile, about, experienceSummary, jobs, skills, timeline, projects, github, windowsCopy } =
    data;

  switch (win.kind) {
    case "profile":
      return (
        <div className="space-y-4">
          <div
            className="mx-auto flex h-28 w-28 items-center justify-center rounded-full text-3xl font-bold text-white shadow-inner"
            style={{
              background: `linear-gradient(135deg, ${profile.heroPlaceholder.gradientFrom}, ${profile.heroPlaceholder.gradientTo})`,
            }}
          >
            {profile.heroPlaceholder.initial}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <p className="text-neutral-600">{profile.title}</p>
            <a className="text-winBlue underline" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </div>
          <ul className="list-disc space-y-2 pl-5 text-neutral-800">
            {profile.headlineLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p>
            <a
              className="text-winBlue underline"
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              GitHub ({profile.githubUsername})
            </a>
          </p>
        </div>
      );
    case "about":
      return (
        <div className="space-y-4 leading-relaxed text-neutral-800">
          <p>{about.intro}</p>
          <p>{about.philosophy}</p>
          <p>{about.goals}</p>
        </div>
      );
    case "experience":
      return (
        <div className="space-y-6">
          <section>
            <h3 className="mb-1 text-lg font-semibold">경력 요약</h3>
            <p className="text-neutral-700">
              총 <strong>{experienceSummary.totalMonths}</strong>개월 —{" "}
              {experienceSummary.headline}
            </p>
          </section>
          {jobs.map((job) => (
            <article key={job.company} className="rounded-md border border-neutral-200 p-3">
              <header className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold">{job.company}</h3>
                <span className="text-sm text-neutral-600">{job.periodLabel}</span>
              </header>
              <p className="text-sm text-neutral-600">
                {job.role} · {job.focus} · {job.durationLabel}
              </p>
              <p className="mt-2 text-neutral-800">{job.summary}</p>
              <div className="mt-3 grid gap-2 text-sm text-neutral-700 sm:grid-cols-2">
                <div>
                  <p className="font-medium text-neutral-900">프레임워크</p>
                  <p>{job.stack.framework}</p>
                </div>
                <div>
                  <p className="font-medium text-neutral-900">언어</p>
                  <p>{job.stack.languages.join(", ")}</p>
                </div>
                <div>
                  <p className="font-medium text-neutral-900">상태</p>
                  <p>{job.stack.state.join(", ")}</p>
                </div>
                <div>
                  <p className="font-medium text-neutral-900">배포</p>
                  <p>{job.stack.deploy.join(", ")}</p>
                </div>
              </div>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-neutral-800">
                {job.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      );
    case "skills":
      return (
        <div className="grid gap-6 md:grid-cols-3">
          <section>
            <h3 className="mb-2 font-semibold text-neutral-900">프론트엔드</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-800">
              {skills.frontend.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="mb-2 font-semibold text-neutral-900">상태 · 데이터</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-800">
              {skills.stateData.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="mb-2 font-semibold text-neutral-900">도구</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-800">
              {skills.tools.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
        </div>
      );
    case "timeline":
      return (
        <ol className="space-y-4 border-l-2 border-winBlue pl-4">
          {timeline.map((item) => (
            <li key={item.title} className="relative">
              <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-winBlue" />
              <p className="text-sm font-medium text-winBlue">{item.dateLabel}</p>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-neutral-700">{item.description}</p>
            </li>
          ))}
        </ol>
      );
    case "projects":
      return (
        <div className="space-y-5">
          {projects.map((p) => (
            <article key={p.slug} className="rounded-md border border-neutral-200 p-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <span className="text-xs text-neutral-500">
                  {p.team} · 기여 {p.contribution}
                </span>
              </div>
              <p className="text-sm text-neutral-600">
                {p.role} · {p.stackSummary}
              </p>
              <p className="mt-2 text-sm text-neutral-700">{p.description}</p>
              <p className="mt-1 text-xs text-neutral-500">환경: {p.env}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.links.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded border border-neutral-300 bg-neutral-50 px-2 py-1 text-xs text-winBlue underline"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      );
    case "github":
      return (
        <div className="space-y-4">
          <p>
            <a className="text-winBlue underline" href={github.profileUrl} target="_blank" rel="noreferrer">
              {github.profileUrl}
            </a>
          </p>
          <div className="overflow-x-auto rounded border border-neutral-200 bg-neutral-50 p-2">
            <Image
              src={github.chartImageUrl}
              alt={`${github.username} contribution graph`}
              width={800}
              height={128}
              className="h-auto max-w-full"
              unoptimized
            />
          </div>
        </div>
      );
    case "recycle":
      return <p className="text-neutral-700">{windowsCopy.trash}</p>;
    default:
      return null;
  }
}
