import type { OpenWindow } from "@/store/desktopStore";
import type { PortfolioPayload } from "@/types/portfolio";

type Props = {
  win: OpenWindow;
  data: PortfolioPayload;
};

export function WindowContents({ win, data }: Props) {
  const { skills, timeline } = data;

  switch (win.kind) {
    case "cursor":
      return (
        <div className="space-y-4 leading-relaxed text-neutral-800">
          <p>
            이 포트폴리오 데스크톱 UI는 <strong>Cursor</strong>로 작업했습니다. AI 보조와 편집기가 한곳에 모여 있어
            빠르게 반복할 수 있습니다.
          </p>
          <p>
            <a className="text-winBlue underline" href="https://cursor.com" target="_blank" rel="noreferrer">
              https://cursor.com
            </a>
          </p>
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
    case "github":
      return null;
    default:
      return null;
  }
}
