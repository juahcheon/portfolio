import type { PortfolioPayload } from "@/types/portfolio";

/** 배포(Vercel): 같은 출처 `/api/v1/portfolio`. 외부 API 테스트 시 env 로 override 가능 */
function getPortfolioUrl(): string {
  const fromEnv =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_PORTFOLIO_API_URL?.trim()
      : undefined;
  if (fromEnv) {
    const base = fromEnv.replace(/\/$/, "");
    return `${base}/v1/portfolio`;
  }
  return "/api/v1/portfolio";
}

export async function fetchPortfolio(): Promise<PortfolioPayload> {
  const res = await fetch(getPortfolioUrl(), {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`portfolio fetch failed: ${res.status}`);
  }
  return res.json() as Promise<PortfolioPayload>;
}
