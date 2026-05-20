import type { OpenWindow } from "@/store/desktopStore";
import type { PortfolioPayload } from "@/types/portfolio";

type Props = {
  win: OpenWindow;
  data: PortfolioPayload;
};

export function WindowContents({ win, data }: Props) {
  const { timeline } = data;

  switch (win.kind) {
    case "cursor":
      return (
        <div className="space-y-4 leading-relaxed text-neutral-800">
          <p className="m-0 text-sm font-semibold text-neutral-900">연락 · 협업</p>
          <p className="m-0 text-sm">
            채용·면접 관련 문의는 이메일로 부탁드립니다. GitHub에서 코드 활동을 확인할 수 있습니다.
          </p>
          <p className="m-0 text-sm">
            <span className="text-neutral-600">이메일</span>{" "}
            <a className="text-winBlue underline" href={`mailto:${data.profile.email}`}>
              {data.profile.email}
            </a>
          </p>
          <p className="m-0 text-sm">
            <span className="text-neutral-600">GitHub</span>{" "}
            <a className="text-winBlue underline" href={data.profile.githubUrl} target="_blank" rel="noreferrer">
              {data.profile.githubUrl}
            </a>
          </p>
          <p className="m-0 border-t border-neutral-200 pt-4 text-sm text-neutral-600">
            이 데스크톱 UI는{" "}
            <a className="text-winBlue underline" href="https://cursor.com" target="_blank" rel="noreferrer">
              Cursor
            </a>
            로 작업했습니다.
          </p>
        </div>
      );
    case "skills":
      return null;
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
